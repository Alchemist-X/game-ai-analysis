# DanZero+ 核心代码深度解析

> 仓库: [submit-paper/Danzero_plus](https://github.com/submit-paper/Danzero_plus)

## 一、整体架构：DQN + PPO 混合决策

DanZero+ 的**最大创新**是「两阶段决策」—— 用预训练的 DQN 缩小候选动作空间，再用 PPO 做最终选择：

```
所有合法出牌 (可能几十上百种)
        │
        ▼
  ┌─────────────┐
  │  阶段1: DQN  │  对每种出牌打分，选出 Top-2
  │  (预训练冻结) │
  └──────┬──────┘
         │ 只留 2 个候选动作
         ▼
  ┌─────────────┐
  │  阶段2: PPO  │  在 2 个候选中选最优的那个
  │  (持续训练)   │
  └──────┬──────┘
         │
         ▼
      最终出牌
```

**为什么这样设计？** 掼蛋的动作空间巨大（各种牌型组合），直接让 PPO 从几百个动作中选一个很难收敛。DQN 先当「粗筛」，PPO 再做「精选」，效率大幅提升。

---

## 二、核心文件详解

### 1. 动作选择逻辑 — `actor_torch/actor.py:96-125`

```python
ActionNumber = 2  # 候选动作数量

def sample(self, state) -> int:
    states = state['x_batch']           # 所有合法动作的状态向量 [N, 567]
    state_no_action = state['x_no_action']  # 不含动作的纯状态 [516]

    if len(states) >= ActionNumber:
        # 阶段1: DQN 对所有合法动作打分，取 Top-2
        indexs = self.model_q.get_max_n_index(states, ActionNumber)
        dqn_states = np.asarray(states[indexs])
        top_actions = dqn_states[:, -54:].flatten()  # 提取 Top-2 动作的牌面编码

        # 拼接: [516维状态] + [54维动作1] + [54维动作2] = 624维
        states = np.concatenate((state_no_action, top_actions))

    # 阶段2: PPO 从 2 个候选中选一个
    action, value, neglogp = self.model.step(states, legal_index)
    return indexs[action]  # 返回最终选中的动作在原始列表中的索引
```

**通俗理解：** 就像考试做选择题 —— DQN 先排除掉明显错误的选项，只留 A 和 B；PPO 再仔细分析，选出最终答案。

---

### 2. 神经网络架构 — `learner_torch/model.py`

#### PPO Actor-Critic 网络 (`MLPActorCritic`)

```
输入: 624 维 = 516(游戏状态) + 54(候选动作1) + 54(候选动作2)
                    │
         ┌──────────┴──────────┐
         │     共享主干网络      │
         │  624→512→512→512→512→256  (5层, Tanh激活, 正交初始化)
         └──────────┬──────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
    ┌──────────┐        ┌──────────┐
    │ 策略头 π  │        │ 价值头 V  │
    │ 256→128→2 │        │ 256→128→1 │
    │ →Categorical│      │ →标量值    │
    └──────────┘        └──────────┘
     输出: 选动作1        输出: 当前状态
     还是动作2            的价值估计
```

关键代码 (`model.py:110-122`):

```python
def step(self, obs, legal_action):
    shared_feature = self.shared(obs)       # 共享主干提取特征
    logits = self.pi(shared_feature)        # 策略头输出 logits
    logits -= (1 - legal_action) * 1e8      # 非法动作的 logit 减去极大值 → 概率≈0
    pi = Categorical(logits=logits)         # 构建分类分布
    a = pi.sample()                         # 按概率采样动作
    logp_a = pi.log_prob(a)                 # 记录该动作的 log 概率
    value = self.v(shared_feature)          # 价值头估计 V(s)
    return a, v, logp_a
```

**合法动作掩码（Legal Action Masking）：** 非法动作的 logits 被减去 10^8，经过 softmax 后概率趋近于零，保证只会选合法出牌。

#### DQN 网络 (`MLPQNetwork`)

```
输入: 567 维 = 513(游戏状态) + 54(某个具体动作)
   │
   567→512→512→512→512→512→1   (5层隐藏层, Tanh激活)
   │
   输出: Q值 (该动作的好坏分数)
```

对每个合法动作算一个 Q 值，然后排序取 Top-N。

---

### 3. PPO 训练算法 — `learner_torch/ppo.py`

```python
class PPOAgent:
    def __init__(self, model,
                 clip_ratio=0.2,    # PPO 裁剪比率
                 lr=1e-4,           # 学习率
                 train_iters=20,    # 每批数据最多迭代20次
                 target_kl=0.01):   # KL散度上限
```

**`update()` 方法 — 核心训练循环** (`ppo.py:23-51`):

```python
def update(self, data):
    for _ in range(self.train_iters):          # 最多迭代20次
        loss_pi, loss_v, loss_ent, pi_info = self.compute_loss(data)

        # 总损失 = 策略损失 + 0.5×价值损失 + 0.05×熵损失
        loss = loss_pi + 0.5 * loss_v + 0.05 * loss_ent

        # 早停: 如果策略变化太大(KL散度超限)就停止
        kl = mpi_avg(pi_info['kl'])
        if kl > 1.5 * self.target_kl:
            break

        loss.backward()
        clip_grad_norm_(self.ac.parameters(), 10)  # 梯度裁剪
        self.optimizer.step()
```

**`compute_loss()` 方法 — 三个损失函数** (`ppo.py:54-80`):

```python
def compute_loss(self, data):
    # ① 策略损失 (PPO-Clip)
    ratio = exp(logp - logp_old)                    # 重要性采样比
    clipped_ratio = clamp(ratio, 0, 3)              # 硬裁剪防爆炸
    clip_adv = clamp(ratio, 0.8, 1.2) * advantage   # 标准PPO裁剪
    loss_pi = -mean(min(clipped_ratio * adv, clip_adv))

    # ② 价值损失 (MSE)
    loss_v = 0.5 * mean((V(s) - Return)²)

    # ③ 熵损失 (鼓励探索)
    loss_ent = -mean(entropy(π))
```

**通俗理解三个损失：**
- **策略损失**：让好的出牌更有可能被选中，差的出牌概率降低。但限制每次更新幅度（clip），避免一步走太远。
- **价值损失**：让价值网络更准确地预估"当前局面能拿多少分"。
- **熵损失**：鼓励 AI 不要太死板，保持一定的探索性。

---

### 4. 状态表示 — `actor_torch/game.py`

掼蛋状态被编码为 **516 维向量**（不含动作）：

| 特征 | 维度 | 含义 |
|------|------|------|
| `my_handcards` | 54 | 我的手牌 |
| `universal_card_flag` | 12 | 万能牌能力标志 |
| `other_handcards` | 54 | 其他三家剩余牌（合计） |
| `last_action` | 54 | 桌面上最新出的牌 |
| `last_teammate_action` | 54 | 队友最近一次出牌 |
| `down_played_cards` | 54 | 下家历史已打牌 |
| `teammate_played_cards` | 54 | 队友历史已打牌 |
| `up_played_cards` | 54 | 上家历史已打牌 |
| `down_num_cards_left` | 28 | 下家剩余牌数 (one-hot) |
| `teammate_num_cards_left` | 28 | 队友剩余牌数 |
| `up_num_cards_left` | 28 | 上家剩余牌数 |
| `self_rank` | 13 | 己方级别 |
| `oppo_rank` | 13 | 敌方级别 |
| `cur_rank` | 13 | 当前级牌 |

**牌面编码：** 54维向量，4花色×13点数+2王，值为张数（0/1/2）。

---

### 5. 奖励函数

```python
rewards = {
    "1100": +3,    # 己方包揽前2名 → "双上" 大胜
    "1010": +2,    # 己方第1、3名
    "1001": +1,    # 己方第1、4名（勉强赢）
    "0110": -1,    # 敌方第1名
    "0101": -2,    # 敌方更强
    "0011": -3,    # 敌方双上，大败
}
```

---

### 6. GAE 优势估计 — `actor_torch/actor.py:171-210`

```python
gamma = 0.99    # 折扣因子
lam = 0.95      # GAE lambda

deltas = rewards + gamma * values[1:] * (1 - dones) - values[:-1]

for t in reversed(range(nsteps)):
    advs[t] = lastgaelam = deltas[t] + gamma * lam * (1-done) * lastgaelam

returns = advs + values[:-1]
```

---

### 7. 分布式训练架构

```
┌─────────────────── Learner (1台) ──────────────────┐
│   MemPool ←── recv_data进程 (ZMQ端口5000)           │
│   (容量2048)        ↑ 接收Actor发来的轨迹数据       │
│      │                                              │
│      ↓ 每收到13批数据训练一次                        │
│   PPOAgent.update() → 采样2048条 → 反向传播          │
│      │                                              │
│      ↓ 每500次更新保存一次                           │
│   ckpt_bak/xxx.pth (共享文件系统)                    │
└─────────────────────────────────────────────────────┘
                        ↕ 权重文件
┌───── Actor (41台机器 × 4个进程 = 164个并行对局) ─────┐
│   danserver (掼蛋游戏引擎, 编译好的二进制)            │
│       ↕ WebSocket                                    │
│   game.py (4个客户端, 解析状态, 编码特征)             │
│       ↕ ZMQ                                          │
│   actor.py (DQN筛选 + PPO决策 + GAE计算)             │
└──────────────────────────────────────────────────────┘
```

---

## 三、算法总结

| 组件 | 技术 | 作用 |
|------|------|------|
| **DQN (预训练)** | Deep Monte Carlo + RMSProp | 对所有合法出牌打分，筛选 Top-2 候选 |
| **PPO (在线训练)** | Actor-Critic + Clipped PPO | 从候选中选最优，学习团队配合 |
| **GAE** | λ=0.95, γ=0.99 | 估计每步出牌的优势值 |
| **合法动作掩码** | logit -= 1e8 | 保证只选合法出牌 |
| **分布式训练** | 41台Actor + ZMQ + 共享文件系统 | 大规模并行数据收集 |
| **正交初始化** | orthogonal_init | 加速深层网络训练收敛 |

**DanZero+ 比原版 DanZero 强在哪？**
1. 原版只有 DQN，每步贪心选 Q 值最大的动作，**不考虑长期协作**
2. DanZero+ 的 PPO 能学到**队友配合策略**
3. PPO 的价值网络能预估整局胜率，做出更有远见的出牌决策
