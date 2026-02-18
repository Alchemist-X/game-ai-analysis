import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'

const complexityData = [
  { name: 'Game Tree', pio: 14, dan: 100, label_pio: '10^14', label_dan: '>>10^100' },
  { name: 'Actions/Step', pio: 5, dan: 80, label_pio: '3-5', label_dan: '10-100+' },
  { name: 'Episode Length', pio: 8, dan: 80, label_pio: '4 rounds', label_dan: '50-100 steps' },
  { name: 'Players', pio: 20, dan: 40, label_pio: '2', label_dan: '4 (2v2)' },
  { name: 'Cards', pio: 48, dan: 100, label_pio: '52 (2 hand)', label_dan: '108 (27 hand)' },
]

const comparisonRows = [
  ['Target Game', 'Texas Hold\'em', 'GuanDan (Egg-Tossing)'],
  ['Players', '2 (heads-up)', '4 (2v2 teams)'],
  ['Method', 'CFR (Counterfactual Regret Min.)', 'PPO + DQN Hybrid RL'],
  ['Solution Type', 'Nash Equilibrium (GTO)', 'Approximate optimal policy'],
  ['Guarantee', 'Mathematically unexploitable', 'No theoretical guarantee'],
  ['Computation', 'Offline solve, lookup at play', 'Online neural network inference'],
  ['Adaptability', 'Fixed strategy', 'Can fine-tune vs specific opponents'],
  ['Team Play', 'N/A (solo game)', 'Core capability (learns cooperation)'],
  ['Explainability', 'High (exact probabilities)', 'Low (black-box neural network)'],
  ['vs Weak Players', 'GTO doesn\'t exploit', 'Naturally exploits weaknesses'],
  ['Speed', 'Instant (table lookup)', '<2ms (neural inference)'],
  ['Cost', '$250-500 software', 'Open source (free)'],
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid #2a2a48', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#4da6ff' }}>PioSolver: {d?.label_pio}</div>
      <div style={{ color: '#b0a6ff' }}>DanZero+: {d?.label_dan}</div>
    </div>
  )
}

export default function VsPioSolver() {
  return (
    <section className="section">
      <h2 className="section-title"><span className="icon">&#x2694;</span> DanZero+ vs PioSolver</h2>
      <p className="section-sub">Two fundamentally different philosophies for solving imperfect-information games</p>

      {/* Philosophy */}
      <div className="vs-container">
        <div className="card vs-card pio">
          <h3 style={{ color: '#4da6ff', marginBottom: 8, fontSize: 20 }}>PioSolver</h3>
          <p style={{ color: '#4da6ff', fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            "Find the unexploitable strategy"
          </p>
          <div className="card-body">
            <p><strong>Philosophy:</strong> Game theory exact solver. Computes Nash Equilibrium (GTO) by traversing the game tree with CFR.</p>
            <p style={{ marginTop: 12 }}><strong>How it works:</strong></p>
            <div className="code-block" style={{ marginTop: 8, fontSize: 12 }}>
              <pre>{`Game Tree (abstracted)
  → CFR iteration (millions of times)
  → Each node: "what if I played differently?"
  → Minimize regret for each action
  → Converge to Nash Equilibrium
  → Output: exact mixed strategy

Example: "AK facing 3-bet"
  → Re-raise: 67%
  → Call: 33%
  → Fold: 0%`}</pre>
            </div>
          </div>
        </div>

        <div className="vs-divider">VS</div>

        <div className="card vs-card dan">
          <h3 style={{ color: '#b0a6ff', marginBottom: 8, fontSize: 20 }}>DanZero+</h3>
          <p style={{ color: '#b0a6ff', fontWeight: 600, fontSize: 15, marginBottom: 16 }}>
            "Find the strategy that wins the most"
          </p>
          <div className="card-body">
            <p><strong>Philosophy:</strong> Reinforcement learning approximation. Neural networks learn from self-play experience using PPO.</p>
            <p style={{ marginTop: 12 }}><strong>How it works:</strong></p>
            <div className="code-block" style={{ marginTop: 8, fontSize: 12 }}>
              <pre>{`Game State → 567-dim vector
  → DQN scores all legal actions
  → Top-2 candidates selected
  → PPO actor-critic chooses final
  → Self-play → collect trajectories
  → PPO update → repeat

Example: "Hand [5,5,5,7,8,...], opponent played pair-3"
  → Play triple-5 (highest confidence)
  → Learned from millions of self-play games`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Complexity Chart */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Game Complexity Comparison (relative scale)</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={complexityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" />
              <XAxis dataKey="name" stroke="#606080" tick={{ fontSize: 12 }} />
              <YAxis stroke="#606080" tick={{ fontSize: 12 }} domain={[0, 100]} label={{ value: 'Relative Scale', angle: -90, position: 'insideLeft', fill: '#606080', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar name="Poker (PioSolver)" dataKey="pio" fill="#4da6ff" radius={[4, 4, 0, 0]} />
              <Bar name="GuanDan (DanZero+)" dataKey="dan" fill="#b0a6ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Comparison Table */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Detailed Comparison</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Dimension</th>
                <th style={{ width: '40%', color: '#4da6ff' }}>PioSolver (Poker)</th>
                <th style={{ width: '40%', color: '#b0a6ff' }}>DanZero+ (GuanDan)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(([dim, pio, dan], i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: 'var(--text)' }}>{dim}</td>
                  <td>{pio}</td>
                  <td>{dan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why CFR fails for GuanDan */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Why CFR Cannot Solve GuanDan</h3>
        <div className="card-grid card-grid-2">
          {[
            { title: 'Game Tree Too Large', desc: '2 decks of 108 cards, 27 per player, hundreds of card combinations per turn. Game tree exceeds 10^100 nodes - even with abstraction, CFR cannot converge.', icon: '&#x1F4C8;' },
            { title: '4-Player Coalition Game', desc: 'CFR works for 2-player zero-sum games. With 4 players in 2 teams, the cooperative-competitive dynamic breaks CFR\'s fundamental assumptions.', icon: '&#x1F465;' },
            { title: 'Massive Action Space', desc: '3-5 actions in poker vs. 10-100+ card combinations per turn in GuanDan. CFR must iterate over every action at every node.', icon: '&#x1F0CF;' },
            { title: 'Long Horizon', desc: '4 betting rounds in poker vs 50-100 card plays in GuanDan. Each additional step multiplies the game tree exponentially.', icon: '&#x23F3;' },
            { title: 'Wildcard Complexity', desc: 'The universal card (rank heart) can substitute any card, making information sets impossible to abstract into manageable "buckets".', icon: '&#x1F0A1;' },
            { title: 'Dynamic Game State', desc: 'Rank level changes, tribute/return mechanics, and player elimination create a non-stationary game structure that CFR cannot handle.', icon: '&#x1F504;' },
          ].map(c => (
            <div className="card" key={c.title}>
              <div className="card-header">
                <div style={{ fontSize: 24 }} dangerouslySetInnerHTML={{ __html: c.icon }} />
                <span className="card-title">{c.title}</span>
              </div>
              <div className="card-body">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Respective Strengths</h3>
        <div className="card-grid card-grid-2">
          <div className="card" style={{ borderTop: '3px solid #4da6ff' }}>
            <h4 style={{ color: '#4da6ff', marginBottom: 12 }}>PioSolver Strengths</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                'Mathematical guarantee - Nash Equilibrium is theoretically optimal',
                'Highly explainable - exact probabilities for every decision',
                'No training needed - direct computation',
                'Stable - solution does not change once computed',
              ].map((s, i) => (
                <li key={i} style={{ padding: '8px 0', fontSize: 14, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: '#4da6ff', marginRight: 8 }}>&#x25CF;</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ borderTop: '3px solid #b0a6ff' }}>
            <h4 style={{ color: '#b0a6ff', marginBottom: 12 }}>DanZero+ Strengths</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                'Scales to games PioSolver cannot handle at all',
                'Learns team cooperation strategies',
                'Can adapt to specific opponents via continued training',
                'Real-time inference <2ms, no lookup tables needed',
              ].map((s, i) => (
                <li key={i} style={{ padding: '8px 0', fontSize: 14, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: '#b0a6ff', marginRight: 8 }}>&#x25CF;</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginTop: 40, textAlign: 'center', padding: 40, background: 'linear-gradient(135deg, rgba(77,166,255,0.05), rgba(176,166,255,0.05))' }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Bottom Line</div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.6 }}>
          PioSolver succeeds because poker is <span style={{ color: '#4da6ff' }}>small enough to solve exactly</span>.
          <br />
          DanZero+ succeeds because it can <span style={{ color: '#b0a6ff' }}>approximate solutions for games too large to solve</span>.
        </div>
      </div>
    </section>
  )
}
