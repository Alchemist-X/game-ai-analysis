# 掼蛋 AI 开源项目调研

5个最优掼蛋 AI 策略 GitHub 仓库，按技术水平从高到低排列。

---

## 1. DanZero+ （当前最强，强化学习）

**仓库：** [submit-paper/Danzero_plus](https://github.com/submit-paper/Danzero_plus)

**技术路线：** 基于 **PPO（近端策略优化）** 的强化学习算法，在 DanZero 基础上进一步提升。使用预训练模型解决巨大动作空间的问题。

**亮点：**
- 目前掼蛋 AI 领域的**最强方案**，发表在 IEEE 顶刊上
- 在对战中全面碾压规则型 AI 和原版 DanZero
- 提供 Docker 镜像，方便部署
- 创新的 DQN+PPO 两阶段混合决策架构

**论文：** [arXiv:2312.02561](https://arxiv.org/abs/2312.02561)

**训练资源需求：** 160 CPU + 1 GPU，训练 30 天

---

## 2. OpenGuanDan（最新基准平台，2026年）

**仓库：** [GameAI-NJUPT/OpenGuanDan](https://github.com/GameAI-NJUPT/OpenGuanDan)

**技术路线：** 完整的掼蛋 AI **评测基准平台**，支持规则型 AI、强化学习 AI、以及**大语言模型（LLM）** 接入。

**亮点：**
- 2026 年最新发布，学术前沿
- 支持人机对战、AI 之间对战
- 每个玩家有独立 API，方便接入自己的策略
- 实验表明：学习型 AI 远超规则型，但仍未达到超人水平

**论文：** [arxiv.org/html/2602.00676](https://arxiv.org/html/2602.00676)

---

## 3. DanZero（第一个掼蛋强化学习 AI）

**仓库：** [AltmanD/guandan_mcc](https://github.com/AltmanD/guandan_mcc)

**技术路线：** 使用**深度蒙特卡洛方法（Deep Monte Carlo）** + 分布式训练框架。

**亮点：**
- **第一个**掼蛋强化学习 AI 程序
- 击败 8 个基于规则的 baseline AI
- 实测达到人类玩家水平
- DanZero+ 的基础代码

**论文：** [arXiv:2210.17087](https://arxiv.org/abs/2210.17087)

**训练资源：** 160 CPU + 1 GPU，训练 30 天

---

## 4. guandan-ai（规则型 AI）

**仓库：** [QinlinChen/guandan-ai](https://github.com/QinlinChen/guandan-ai)

**技术路线：** 纯**规则驱动（Rule-Based）** 的掼蛋 AI。通过手工编写策略规则来决定出牌。

**亮点：**
- 代码简洁，容易理解和二次开发
- 不需要 GPU 和大量训练资源
- 适合**入门学习**掼蛋 AI 的逻辑和牌型处理
- 可以作为强化学习 AI 的 baseline 对手

---

## 5. AI-Card-Game-Guandan（带 GUI 的完整掼蛋游戏）

**仓库：** [flowermouse/AI-Card-Game-Guandan](https://github.com/flowermouse/AI-Card-Game-Guandan)

**技术路线：** Python 实现，包含完整的掼蛋规则引擎 + AI 对手 + 可视化界面。

**亮点：**
- 南京大学 2024 年 AI 课程设计项目
- 完整实现掼蛋规则（牌型识别、进贡还贡、升级等）
- 有图形界面，可以直接**人机对战**
- 适合想快速上手玩和理解掼蛋 AI 的人

---

## 总结对比

| 仓库 | 方法 | 难度 | 实力 | 适合人群 |
|------|------|------|------|---------|
| **DanZero+** | PPO 强化学习 | 高 | 最强 | 研究者/进阶开发者 |
| **OpenGuanDan** | 评测平台 | 中-高 | 多种 AI | 研究者/想对比策略的人 |
| **DanZero** | 深度蒙特卡洛 | 高 | 强 | 想复现论文的研究者 |
| **guandan-ai** | 规则型 | 低 | 中 | 入门学习者 |
| **AI-Card-Game-Guandan** | 规则+GUI | 低 | 中 | 想直接玩的人 |

> **建议路线：** guandan-ai (理解规则) → DanZero (理解RL框架) → DanZero+ (前沿研究) → OpenGuanDan (系统评测)
