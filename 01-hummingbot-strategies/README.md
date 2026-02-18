# Hummingbot 做市与套利策略分析

> 来源: [hummingbot/hummingbot](https://github.com/hummingbot/hummingbot)

## 做市策略 (Market Making)

### 1. Pure Market Making（纯做市策略）
**路径:** `hummingbot/strategy/pure_market_making/`

**原理：** 在单个交易所的买卖两侧挂限价单，赚取买卖价差（spread）。机器人在中间价上下按设定的价差挂单，定时刷新订单以适应市场变化。

**核心参数：**
- `bid_spread` / `ask_spread` — 买/卖单距中间价的距离
- `order_amount` — 每笔订单大小
- `order_refresh_time` — 刷新订单的时间间隔
- `inventory_skew_enabled` — 根据库存偏斜调整价差，防止单边持仓过多
- `hanging_orders_enabled` — 价格远离时保留未成交订单

**通俗理解：** 就像一个小贩，同时报出买入价和卖出价，赚中间的差价。如果手上的货太多了，就把卖价压低一点尽快出货。

---

### 2. Avellaneda Market Making（Avellaneda 做市策略）
**路径:** `hummingbot/strategy/avellaneda_market_making/`

**原理：** 基于 Avellaneda-Stoikov 学术模型，**动态计算**最优买卖价差。根据市场波动率、交易强度和库存风险，自动调整挂单位置。在高波动市场中特别有效。

**核心参数：**
- `risk_factor` — 风险厌恶系数（越大越保守，价差越宽）
- `volatility_buffer_size` — 波动率计算的样本窗口
- `min_spread` — 最小价差保护

**通俗理解：** 在纯做市的基础上加了"智能大脑"——市场波动大时自动拉宽价差保护自己，市场平静时缩小价差多吃单。

---

### 3. Perpetual Market Making（永续合约做市）
**路径:** `hummingbot/strategy/perpetual_market_making/`

**原理：** 专门为永续合约市场设计的做市策略。支持杠杆交易，并内置止盈止损机制来管理持仓风险。

**核心参数：**
- `leverage` — 杠杆倍数（如 10x、20x）
- `long_profit_taking_spread` / `short_profit_taking_spread` — 多/空止盈价差
- `stop_loss_spread` — 止损距离

**通俗理解：** 和纯做市类似，但是在合约市场做，可以开杠杆放大收益，同时设好止盈止损防止爆仓。

---

### 4. Liquidity Mining（流动性挖矿策略）
**路径:** `hummingbot/strategy/liquidity_mining/`

**原理：** 同时在**多个交易对**上提供流动性，赚取流动性挖矿奖励。根据波动率动态调整价差，自动分配资金到不同交易对。

**核心参数：**
- `markets` — 多个交易对列表
- `volatility_to_spread_multiplier` — 波动率到价差的乘数
- `inventory_skew_enabled` — 跨交易对平衡库存

**通俗理解：** 同时在好几个交易对当做市商，哪个对有奖励就去哪里挂单，像"多线程打工"。

---

### 5. PMM Dynamic（动态做市控制器，V2架构）
**路径:** `controllers/market_making/pmm_dynamic.py`

**原理：** 使用 **MACD 指标**偏移中间价，用 **NATR（归一化ATR）** 自适应调整价差。结合三重屏障（Triple Barrier）做风控。

**核心参数：**
- `macd_fast` / `macd_slow` / `macd_signal` — MACD 参数
- `natr_length` — 波动率计算长度
- `triple_barrier_config` — 止盈/止损/超时配置

**通俗理解：** 用技术指标判断趋势方向，顺势挂单。MACD 看多时买单更积极，卖单更保守。

---

## 套利策略 (Arbitrage)

### 6. Cross-Exchange Market Making / XEMM（跨交易所做市套利）
**路径:** `hummingbot/strategy/cross_exchange_market_making/`

**原理：** 在一个交易所（maker）挂单做市，成交后立刻在另一个交易所（taker）对冲。只有当两个交易所之间存在价差且有利可图时才挂单。

**核心参数：**
- `maker_market` / `taker_market` — 做市/对冲交易所
- `min_profitability` — 最低利润率门槛
- `slippage_buffer` — 滑点缓冲

**通俗理解：** A交易所BTC卖30000，B交易所卖30100。在A挂买单等成交，成交后立刻在B卖掉，赚100差价。

---

### 7. AMM Arbitrage（AMM 套利）
**路径:** `hummingbot/strategy/amm_arb/`

**原理：** 在 **DEX（如Uniswap）** 和 **CEX** 之间套利。检测两边的价差，超过阈值时同时下单。

**核心参数：**
- `connector_1` / `connector_2` — 两个市场
- `min_profitability` — 最低利润门槛（如 0.3%）
- `concurrent_orders_submission` — 是否同时提交两边订单

**通俗理解：** Uniswap上ETH便宜，Binance上ETH贵 → 在Uniswap买，Binance卖，赚差价。

---

### 8. Spot-Perpetual Arbitrage（现货-合约套利）
**路径:** `hummingbot/strategy/spot_perpetual_arbitrage/`

**原理：** 利用同一资产在**现货市场和永续合约市场**之间的价差套利。当价差超过阈值时开仓，缩小到阈值时平仓。

**核心参数：**
- `perpetual_leverage` — 合约杠杆
- `min_opening_arbitrage_pct` — 最低开仓价差（如 0.3%）
- `min_closing_arbitrage_pct` — 最低平仓价差

**通俗理解：** 现货BTC 30000，合约BTC 30300。现货买入+合约做空，等价差收敛后同时平掉，赚取基差收益。经典**期现套利**。

---

### 9. Funding Rate Arbitrage（资金费率套利）
**路径:** `scripts/v2_funding_rate_arb.py`

**原理：** 在两个永续合约交易所之间，利用**资金费率差异**套利。在资金费率高的交易所做空，费率低的做多，保持市场中性。

**核心参数：**
- `min_funding_rate_profitability` — 最低资金费率差异
- `leverage` — 杠杆倍数
- `profitability_to_take_profit` — 止盈目标

**通俗理解：** A交易所多头每8小时付0.1%资金费，B交易所只付0.01%。在A做空收费，B做多少付费，**对冲后净赚资金费差额**。

---

### 10. Cross-Exchange Mining（跨交易所挖矿套利）
**路径:** `hummingbot/strategy/cross_exchange_mining/`

**原理：** 跨交易所做市的增强版。在套利的同时，**自动在两个交易所之间调配资金平衡**，并根据波动率动态调整利润阈值。

**核心参数：**
- `balance_adjustment_duration` — 资金再平衡间隔
- `min_prof_tol_low` / `min_prof_tol_high` — 利润容忍区间
- `volatility_buffer_size` — 波动率窗口

**通俗理解：** 类似跨交易所套利，但更智能——自动把钱从资金多的交易所搬到少的交易所，保证两边都有足够资金继续套利。

---

## 总结对比表

| 策略 | 类型 | 风险 | 核心思路 |
|------|------|------|---------|
| Pure MM | 做市 | 中 | 单交易所挂买卖单赚价差 |
| Avellaneda MM | 做市 | 中 | 数学模型动态优化价差 |
| Perpetual MM | 做市 | 高 | 合约做市+杠杆 |
| Liquidity Mining | 做市 | 中 | 多交易对同时做市赚奖励 |
| PMM Dynamic | 做市 | 中 | 技术指标辅助做市 |
| XEMM | 套利 | 低-中 | 跨交易所价差套利+对冲 |
| AMM Arb | 套利 | 中 | DEX vs CEX 套利 |
| 现货-合约套利 | 套利 | 低-中 | 期现基差套利 |
| 资金费率套利 | 套利 | 低 | 多空对冲赚资金费差 |
| 跨交易所挖矿 | 套利 | 低-中 | 跨所套利+自动再平衡 |

> **风险提示：** 所有量化策略都有风险，包括但不限于：滑点、延迟、交易所宕机、极端行情穿仓等。建议先用模拟盘测试。
