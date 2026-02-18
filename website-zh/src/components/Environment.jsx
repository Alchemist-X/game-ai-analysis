import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell } from 'recharts'

const latencyData = [
  { actions: '1', ms: 0.66 },
  { actions: '5', ms: 0.97 },
  { actions: '10', ms: 1.09 },
  { actions: '30', ms: 1.35 },
  { actions: '50', ms: 1.70 },
  { actions: '100', ms: 2.67 },
]

const systemData = [
  { metric: 'Model Init', value: '0.064s', icon: '&#x23F1;' },
  { metric: 'PPO Params', value: '1,305,475', icon: '&#x1F9E0;' },
  { metric: 'DQN Params', value: '1,341,953', icon: '&#x1F4CA;' },
  { metric: 'Total Params', value: '2,647,428', icon: '&#x2211;' },
  { metric: 'Model Size', value: '~10 MB', icon: '&#x1F4BE;' },
  { metric: 'Inference', value: '1.16 ms/step', icon: '&#x26A1;' },
  { metric: 'Throughput', value: '860 steps/s', icon: '&#x1F680;' },
  { metric: 'Game Time', value: '~1.94s/game', icon: '&#x1F3B4;' },
  { metric: 'Peak Memory', value: '352 MB', icon: '&#x1F4BB;' },
]

const protocolMessages = [
  { type: 'notify', stage: 'beginning', desc: 'Game starts, deal 27 cards each', color: '#4da6ff' },
  { type: 'act', stage: 'tribute', desc: 'Tribute phase (losers give best card)', color: '#ff9f43' },
  { type: 'act', stage: 'back', desc: 'Return tribute (winner gives small card)', color: '#ff9f43' },
  { type: 'act', stage: 'play', desc: 'Play cards - AI must decide', color: '#7c6cf0' },
  { type: 'notify', stage: 'play', desc: 'Broadcast: someone played cards', color: '#4da6ff' },
  { type: 'notify', stage: 'episodeOver', desc: 'Game ends, finish order revealed', color: '#00e0a8' },
]

const capabilityData = [
  { subject: 'Game Engine', current: 95, required: 95 },
  { subject: 'Inference', current: 90, required: 90 },
  { subject: 'Full Game', current: 85, required: 85 },
  { subject: 'GPU', current: 5, required: 90 },
  { subject: 'Cluster', current: 3, required: 95 },
  { subject: 'Pretrained Weights', current: 10, required: 100 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid #2a2a48', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 700 }}>{label} legal actions</div>
      <div style={{ color: '#7c6cf0' }}>{payload[0].value} ms / step</div>
    </div>
  )
}

export default function Environment() {
  return (
    <section className="section">
      <h2 className="section-title"><span className="icon">&#x2699;</span> Environment Evaluation</h2>
      <p className="section-sub">Runtime benchmark on current system: AMD EPYC 9354P (4 cores), 16GB RAM, no GPU</p>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {systemData.map(s => (
          <div key={s.metric} className="card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 24 }} dangerouslySetInnerHTML={{ __html: s.icon }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-light)', marginTop: 8 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.metric}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="card-grid card-grid-2">
        <div className="chart-container">
          <div className="chart-title">Inference Latency vs Action Space Size</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={latencyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" />
              <XAxis dataKey="actions" stroke="#606080" tick={{ fontSize: 12 }} label={{ value: 'Legal Actions', position: 'insideBottom', offset: -2, fill: '#606080', fontSize: 11 }} />
              <YAxis stroke="#606080" tick={{ fontSize: 12 }} label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: '#606080', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ms" radius={[6, 6, 0, 0]}>
                {latencyData.map((entry, i) => (
                  <Cell key={i} fill={entry.ms > 2 ? '#ff6b6b' : entry.ms > 1.2 ? '#ffd93d' : '#00e0a8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-title">System Capability: Current vs Required for Training</div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={capabilityData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#1c1c30" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9090b0' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: '#606080' }} domain={[0, 100]} />
              <Radar name="Current System" dataKey="current" stroke="#00e0a8" fill="#00e0a8" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Required for Training" dataKey="required" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.08} strokeWidth={2} strokeDasharray="5 5" />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Game Server Architecture */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Game Server Architecture</h3>
        <div className="arch-diagram">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            Data Flow Per Turn
          </div>
          <div className="arch-flow">
            <div className="arch-stage env">
              <h4 style={{ color: '#00e0a8' }}>danserver</h4>
              <p>Game Engine (Binary)</p>
              <p style={{ fontSize: 11 }}>Port 23456</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>WebSocket</div>
              </div>
            </div>
            <div className="arch-stage" style={{ background: 'var(--yellow-dim)', border: '1px solid rgba(255,217,61,0.3)' }}>
              <h4 style={{ color: '#ffd93d' }}>game.py</h4>
              <p>State Encoder</p>
              <p style={{ fontSize: 11 }}>Translate cards to 567-dim vectors</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ</div>
              </div>
            </div>
            <div className="arch-stage ppo">
              <h4 style={{ color: '#b0a6ff' }}>actor.py</h4>
              <p>AI Brain</p>
              <p style={{ fontSize: 11 }}>DQN + PPO inference</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2192;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ</div>
              </div>
            </div>
            <div className="arch-stage dqn">
              <h4 style={{ color: '#4da6ff' }}>Learner</h4>
              <p>PPO Training</p>
              <p style={{ fontSize: 11 }}>Port 5000</p>
            </div>
          </div>
        </div>
      </div>

      {/* WebSocket Protocol */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>WebSocket Protocol</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Type</th><th>Stage</th><th>Description</th><th>AI Response</th></tr>
            </thead>
            <tbody>
              {protocolMessages.map((m, i) => (
                <tr key={i}>
                  <td><span className="tag" style={{ background: m.type === 'act' ? 'var(--red-dim)' : 'var(--blue-dim)', color: m.type === 'act' ? 'var(--red)' : 'var(--blue)' }}>{m.type}</span></td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{m.stage}</td>
                  <td>{m.desc}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {m.type === 'act' ? '{"actIndex": N}' : 'None (observe only)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verdict */}
      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Verdict</h3>
        <div className="card-grid card-grid-2">
          {[
            { title: 'Can Run', items: ['danserver game engine (x86-64 compatible)', 'Full inference pipeline (CPU, ~1.16ms/step)', 'Complete game episodes (~1.94s/game)', 'Strategy evaluation & win-rate testing'], color: '#00e0a8' },
            { title: 'Cannot Run', items: ['Full training (needs GPU cluster)', 'Distributed 41-machine actor setup', 'Pretrained DQN weights (need from author)', '30-day training cycle (160 CPU + 1 GPU)'], color: '#ff6b6b' },
          ].map(v => (
            <div className="card" key={v.title} style={{ borderTop: `3px solid ${v.color}` }}>
              <h4 style={{ color: v.color, marginBottom: 12 }}>{v.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {v.items.map((item, i) => (
                  <li key={i} style={{ padding: '6px 0', fontSize: 14, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: v.color, marginRight: 8, fontWeight: 700 }}>
                      {v.color === '#00e0a8' ? '\u2713' : '\u2717'}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
