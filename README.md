# Game AI Analysis

掼蛋 (GuanDan) AI 策略研究 & 量化交易策略分析

## 项目结构

```
game-ai-analysis/
├── 01-hummingbot-strategies/    # Hummingbot 做市与套利策略分析
├── 02-guandan-repos/            # 掼蛋 AI 开源项目调研
├── 03-danzero-plus-code-analysis/ # DanZero+ 核心代码深度解析
├── 04-danzero-plus-environment/   # DanZero+ 环境评估与运行测试
├── 05-danzero-vs-piosolver/       # DanZero+ vs PioSolver 对比分析
```

## 概览

| 分析模块 | 内容 |
|---------|------|
| **Hummingbot** | 10个做市(MM)和套利(Arbitrage)策略的原理、参数、风险分析 |
| **掼蛋 AI 调研** | 5个最优掼蛋策略 GitHub 仓库的对比 |
| **DanZero+ 代码** | 完整的 DQN+PPO 混合架构、神经网络、训练流程代码解析 |
| **环境评估** | 当前系统配置下的实际运行测试（推理性能、对局模拟） |
| **PioSolver 对比** | 博弈论精确求解 vs 强化学习近似求解的全方位对比 |

## 核心发现

- DanZero+ 的创新在于 **两阶段决策**：DQN 粗筛候选动作 → PPO 精选最优出牌
- 掼蛋的博弈树规模 (>>10^100) 使得 PioSolver 式的 CFR 精确求解完全不可行
- 当前 CPU 环境可正常运行推理 (~1.16ms/步)，但无法完成完整训练

## 关键引用

- [DanZero+: Dominating the GuanDan Game through RL](https://arxiv.org/abs/2312.02561) (IEEE 2024)
- [DanZero: Mastering GuanDan Game with RL](https://arxiv.org/abs/2210.17087) (2022)
- [OpenGuanDan Benchmark](https://arxiv.org/html/2602.00676) (2026)
- [Hummingbot](https://github.com/hummingbot/hummingbot) - 开源量化交易框架
