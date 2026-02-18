import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const costData = [
  { name: 'H100 (Lambda)', monthly: 1800, days: 150, total: 9000, actors: 8, color: '#ff6b6b' },
  { name: 'H100 (AWS p5)', monthly: 7900, days: 90, total: 23700, actors: 15, color: '#ff9f43' },
  { name: 'A10G+64CPU', monthly: 2950, days: 60, total: 5900, actors: 20, color: '#4da6ff' },
  { name: 'L4+64CPU \u5206\u79BB', monthly: 2350, days: 60, total: 4700, actors: 20, color: '#00e0a8' },
  { name: '\u56FD\u5185 4090+CPU', monthly: 700, days: 100, total: 2300, actors: 10, color: '#b0a6ff' },
]

const cpuCompare = [
  { name: '\u5F53\u524D 4C EPYC', cores: 4, threads: 8, actors: 1, score: 5 },
  { name: 'Ryzen 9 7950X', cores: 16, threads: 32, actors: 8, score: 25 },
  { name: 'EPYC 9354P 32C', cores: 32, threads: 64, actors: 20, score: 50 },
  { name: 'TR 7970X 32C', cores: 32, threads: 64, actors: 20, score: 50 },
  { name: '\u53CC\u8DEF EPYC 128C', cores: 128, threads: 256, actors: 40, score: 100 },
]

const gpuCompare = [
  { name: 'RTX 3060', vram: 12, tflops: 12.7, price: '$300', overkill: '50x' },
  { name: 'RTX 4060', vram: 8, tflops: 15.1, price: '$300', overkill: '60x' },
  { name: 'RTX 4090', vram: 24, tflops: 82.6, price: '$1600', overkill: '330x' },
  { name: 'A10G', vram: 24, tflops: 31.2, price: '\u4E91', overkill: '125x' },
  { name: 'A100', vram: 40, tflops: 77.9, price: '\u4E91', overkill: '310x' },
  { name: 'H100', vram: 80, tflops: 989, price: '\u4E91', overkill: '3960x' },
]

const tierData = [
  { subject: 'CPU \u6838\u5FC3', t1: 16, t2: 64, t3: 128, paper: 160 },
  { subject: 'GPU \u7B97\u529B', t1: 80, t2: 80, t3: 80, paper: 80 },
  { subject: 'RAM (GB)', t1: 30, t2: 60, t3: 95, paper: 100 },
  { subject: 'Actor \u6570', t1: 20, t2: 50, t3: 95, paper: 100 },
  { subject: '\u8BAD\u7EC3\u901F\u5EA6', t1: 10, t2: 40, t3: 95, paper: 100 },
  { subject: '\u6027\u4EF7\u6BD4', t1: 100, t2: 70, t3: 40, paper: 20 },
]

const cloudServices = [
  { provider: 'AWS', cpu: 'c6a.16xlarge (64 vCPU)', gpu: 'g6.xlarge (1\u00D7L4)', cpuCost: '$2.47/h', gpuCost: '$0.80/h', total: '~$2,350/\u6708', region: '\u7F8E\u56FD' },
  { provider: 'GCP', cpu: 'c3-highcpu-88 (88 vCPU)', gpu: 'g2-standard-4 (1\u00D7L4)', cpuCost: '$3.20/h', gpuCost: '$0.84/h', total: '~$2,900/\u6708', region: '\u7F8E\u56FD/\u6B27\u6D32' },
  { provider: 'Lambda Labs', cpu: '\u2014', gpu: 'gpu_1x_a100 (30 vCPU)', cpuCost: '\u2014', gpuCost: '$1.10/h', total: '~$800/\u6708', region: '\u7F8E\u56FD' },
  { provider: '\u963F\u91CC\u4E91', cpu: 'ecs.g7.16xlarge', gpu: 'GPU \u5B9E\u4F8B', cpuCost: '\u00A58/h', gpuCost: '\u00A512/h', total: '~\u00A514,400/\u6708', region: '\u4E2D\u56FD' },
  { provider: 'AutoDL', cpu: '\u6346\u7ED1', gpu: 'RTX 4090 \u5B9E\u4F8B', cpuCost: '\u2014', gpuCost: '\u00A52\u20133/h', total: '~\u00A53,000/\u6708', region: '\u4E2D\u56FD' },
  { provider: '\u6052\u6E90\u4E91', cpu: '\u6346\u7ED1', gpu: 'A100/4090 \u5B9E\u4F8B', cpuCost: '\u2014', gpuCost: '\u00A53\u20138/h', total: '~\u00A55,000/\u6708', region: '\u4E2D\u56FD' },
]

const CostTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid #2a2a48', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#4da6ff' }}>\u6708\u8D39: ${d?.monthly?.toLocaleString()}</div>
      <div style={{ color: '#00e0a8' }}>\u8BAD\u7EC3\u5929\u6570: ~{d?.days}\u5929</div>
      <div style={{ color: '#ff9f43' }}>\u603B\u8D39\u7528: ${d?.total?.toLocaleString()}</div>
      <div style={{ color: '#b0a6ff' }}>\u5E76\u884C Actor: {d?.actors}\u4E2A</div>
    </div>
  )
}

export default function Hardware() {
  return (
    <section className="section">
      <h2 className="section-title"><span className="icon">&#x1F5A5;</span> \u786C\u4EF6\u9700\u6C42\u5206\u6790</h2>
      <p className="section-sub">CPU \u5BC6\u96C6\u578B\u5206\u5E03\u5F0F\u8BAD\u7EC3\uFF1ADanZero+ \u5B9E\u9645\u9700\u8981\u4EC0\u4E48\u6837\u7684\u786C\u4EF6</p>

      {/* Key Insight */}
      <div className="card" style={{ borderTop: '3px solid #ff9f43', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ fontSize: 36 }}>&#x26A0;</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>\u6838\u5FC3\u7ED3\u8BBA\uFF1A\u74F6\u9888\u5728 CPU\uFF0C\u4E0D\u5728 GPU</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
              DanZero+ \u603B\u5171\u53EA\u6709 <strong style={{ color: 'var(--accent-light)' }}>2.65M \u53C2\u6570 (\u7EA610 MB)</strong> \u2014\u2014 \u6BD4\u73B0\u4EE3 LLM \u5C0F\u51E0\u5343\u500D\u3002
              GPU (Learner) \u6BCF\u6B21 PPO \u66F4\u65B0\u53EA\u9700\u6BEB\u79D2\u7EA7\uFF0C\u5927\u90E8\u5206\u65F6\u95F4\u5728<em>\u7B49\u6570\u636E</em>\u3002
              \u771F\u6B63\u7684\u74F6\u9888\u662F <strong style={{ color: '#ff9f43' }}>CPU \u6838\u5FC3\u6570\u8DD1\u5E76\u884C\u5BF9\u5C40\u751F\u6210\u8BAD\u7EC3\u6570\u636E</strong>\u3002
              CPU \u6838\u8D8A\u591A = \u5E76\u884C\u5BF9\u5C40\u8D8A\u591A = \u6570\u636E\u751F\u6210\u8D8A\u5FEB = \u8BAD\u7EC3\u8D8A\u5FEB\u3002
            </p>
          </div>
        </div>
      </div>

      {/* Original Paper Setup */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u539F\u8BBA\u6587\u8BAD\u7EC3\u914D\u7F6E</h3>
        <div className="arch-diagram">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            \u5206\u5E03\u5F0F\u67B6\u6784 (41 \u53F0 Actor \u673A\u5668 + 1 \u53F0 GPU Learner)
          </div>
          <div className="arch-flow">
            <div className="arch-stage env" style={{ minWidth: 240 }}>
              <h4 style={{ color: '#00e0a8' }}>41 \u4E2A Actor \u5BB9\u5668</h4>
              <p>\u6BCF\u5BB9\u5668 4 \u4E2A player = 164 \u8FDB\u7A0B</p>
              <p style={{ fontSize: 11 }}>\u7EAF CPU \u8FD0\u884C\uFF0C\u6BCF\u4E2A 8 \u7EBF\u7A0B</p>
              <p style={{ fontSize: 11 }}>\u5185\u5B58\u4E0A\u9650 0.7 GB/actor</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Port 5000/5001</div>
              </div>
            </div>
            <div className="arch-stage ppo" style={{ minWidth: 240 }}>
              <h4 style={{ color: '#b0a6ff' }}>1 \u53F0 GPU Learner</h4>
              <p>\u5728 GPU \u4E0A\u8FDB\u884C PPO \u8BAD\u7EC3</p>
              <p style={{ fontSize: 11 }}>Batch 2048\uFF0C20 \u6B65\u68AF\u5EA6\u66F4\u65B0</p>
              <p style={{ fontSize: 11 }}>\u6BCF\u6536 13 \u6279\u6570\u636E\u8BAD\u7EC3\u4E00\u6B21</p>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, textAlign: 'center' }}>
            {[
              { label: '\u603B CPU \u6838\u6570', value: '~160 \u6838', color: '#00e0a8' },
              { label: 'GPU', value: '1 \u5757 (\u4EFB\u610F)', color: '#b0a6ff' },
              { label: '\u8BAD\u7EC3\u65F6\u95F4', value: '~30 \u5929', color: '#ff9f43' },
              { label: '\u5E76\u884C\u5BF9\u5C40', value: '41 \u573A\u540C\u65F6', color: '#4da6ff' },
            ].map(s => (
              <div key={s.label} style={{ padding: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CPU Analysis */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>CPU \u9700\u6C42\uFF1A\u6700\u5173\u952E\u7684\u8D44\u6E90</h3>
        <div className="card-grid card-grid-2">
          <div className="card">
            <h4 style={{ color: '#00e0a8', marginBottom: 12 }}>\u5355\u4E2A Actor \u8D44\u6E90\u6D88\u8017</h4>
            <div className="table-wrap">
              <table>
                <tbody>
                  {[
                    ['\u8FDB\u7A0B\u6570', '~10', 'danserver + 4 game + 4 player + watchdog'],
                    ['CPU \u7EBF\u7A0B', '8', 'torch.set_num_threads(8)'],
                    ['\u5185\u5B58\u4E0A\u9650', '0.7 GB', '\u8D85\u51FA\u81EA\u52A8\u91CD\u542F'],
                    ['\u7AEF\u53E3\u5360\u7528', '5 \u4E2A', '23456 (WS) + 6000-6003 (ZMQ)'],
                    ['\u63A8\u7406\u6A21\u5F0F', '\u7EAF CPU', 'CUDA_VISIBLE_DEVICES=-1'],
                  ].map(([k, v, d]) => (
                    <tr key={k}>
                      <td style={{ fontWeight: 600, color: 'var(--text)' }}>{k}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{v}</td>
                      <td style={{ fontSize: 12 }}>{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <h4 style={{ color: '#4da6ff', marginBottom: 12 }}>CPU \u6269\u5C55\u5206\u6790</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>CPU \u578B\u53F7</th><th>\u6838\u5FC3</th><th>\u6700\u5927 Actor</th><th>\u8FBE\u5230\u8BBA\u6587</th></tr>
                </thead>
                <tbody>
                  {cpuCompare.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{c.name}</td>
                      <td style={{ fontWeight: 700 }}>{c.cores}C/{c.threads}T</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{c.actors}</td>
                      <td>{c.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              \u7ECF\u9A8C\u6CD5\u5219\uFF1A\u6BCF\u4E2A Actor \u9700\u8981 ~2\u20134 \u4E2A\u4E13\u7528 CPU \u6838\u624D\u80FD\u6EE1\u8F7D\u8FD0\u884C
            </p>
          </div>
        </div>
      </div>

      {/* GPU Analysis */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>GPU \u9700\u6C42\uFF1A\u4EFB\u4F55\u73B0\u4EE3 GPU \u90FD\u591F\u7528</h3>
        <div className="card" style={{ borderTop: '3px solid #00e0a8' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ fontSize: 36 }}>&#x1F4A1;</div>
            <div>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
                \u6A21\u578B\u53EA\u9700 <strong style={{ color: 'var(--accent-light)' }}>~10 MB \u663E\u5B58</strong>\uFF0C\u6BCF\u6B21 PPO \u66F4\u65B0\u53EA\u9700\u5FAE\u79D2\u7EA7 GPU \u8BA1\u7B97\u3002
                \u5373\u4F7F\u662F <strong>$300 \u7684 RTX 3060</strong> \u4E5F\u63D0\u4F9B\u4E86 50 \u500D\u4E8E\u6240\u9700\u7684\u7B97\u529B\u3002
                \u4E00\u5F20 H100 ($10+/\u5C0F\u65F6) \u4F1A\u6D6A\u8D39 <strong>99.99%</strong> \u7684 80GB \u663E\u5B58\u548C 989 TFLOPS \u7B97\u529B\u3002
              </p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>GPU</th><th>\u663E\u5B58</th><th>TFLOPS (FP32)</th><th>\u4EF7\u683C</th><th>\u8FC7\u5269\u500D\u6570</th></tr>
              </thead>
              <tbody>
                {gpuCompare.map(g => (
                  <tr key={g.name}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{g.name}</td>
                    <td>{g.vram} GB</td>
                    <td>{g.tflops}</td>
                    <td>{g.price}</td>
                    <td style={{ color: g.tflops > 80 ? '#ff6b6b' : g.tflops > 30 ? '#ff9f43' : '#00e0a8', fontWeight: 700 }}>{g.overkill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Three Tiers */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u4E09\u6863\u786C\u4EF6\u65B9\u6848</h3>
        <div className="card-grid card-grid-2">
          <div>
            <div className="card-grid" style={{ gap: 16 }}>
              {[
                {
                  tier: '\u65B9\u6848\u4E00\uFF1A\u6700\u4F4E\u53EF\u884C',
                  color: '#ffd93d',
                  cpu: 'AMD Ryzen 9 7950X (16C/32T)',
                  gpu: 'RTX 3060 12GB / RTX 4060',
                  ram: '64 GB DDR5',
                  actors: '4\u20138 \u4E2A Actor',
                  time: '~150\u2013300 \u5929',
                  cost: '~$1,000 / \u00A57,000',
                  use: '\u9A8C\u8BC1\u4EE3\u7801\u3001\u5C0F\u89C4\u6A21\u5B9E\u9A8C'
                },
                {
                  tier: '\u65B9\u6848\u4E8C\uFF1A\u63A8\u8350\u914D\u7F6E',
                  color: '#00e0a8',
                  cpu: 'AMD EPYC 9354P (32C/64T) \u6216 Threadripper 7970X',
                  gpu: 'RTX 4070 12GB',
                  ram: '128 GB DDR5 ECC',
                  actors: '16\u201320 \u4E2A Actor',
                  time: '~60\u201380 \u5929',
                  cost: '~$2,500\u2013$3,000 / \u00A518,000\u201321,000',
                  use: '\u8BA4\u771F\u505A\u7814\u7A76\u3001\u8C03\u53C2\u5B9E\u9A8C'
                },
                {
                  tier: '\u65B9\u6848\u4E09\uFF1A\u5B8C\u5168\u590D\u73B0',
                  color: '#4da6ff',
                  cpu: '2\u00D7 AMD EPYC 9554 (\u53CC\u8DEF 128C/256T)',
                  gpu: 'RTX 4070 / A4000',
                  ram: '256 GB DDR5 ECC',
                  actors: '40+ \u4E2A Actor',
                  time: '~30\u201335 \u5929',
                  cost: '~$9,500\u2013$10,000 / \u00A568,000\u201370,000',
                  use: '\u5B8C\u5168\u590D\u73B0\u8BBA\u6587\u3001\u5927\u89C4\u6A21\u5BF9\u6BD4\u5B9E\u9A8C'
                },
              ].map(t => (
                <div className="card" key={t.tier} style={{ borderLeft: `4px solid ${t.color}` }}>
                  <h4 style={{ color: t.color, marginBottom: 12 }}>{t.tier}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 12px', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>CPU</span>
                    <span style={{ color: 'var(--text)' }}>{t.cpu}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>GPU</span>
                    <span style={{ color: 'var(--text)' }}>{t.gpu}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u5185\u5B58</span>
                    <span style={{ color: 'var(--text)' }}>{t.ram}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Actor \u6570</span>
                    <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{t.actors}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u65F6\u95F4</span>
                    <span style={{ color: 'var(--text)' }}>{t.time}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u8D39\u7528</span>
                    <span style={{ color: t.color, fontWeight: 700 }}>{t.cost}</span>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>\u9002\u5408\uFF1A{t.use}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-title">\u786C\u4EF6\u65B9\u6848\u5BF9\u6BD4 (Radar)</div>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={tierData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid stroke="#1c1c30" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9090b0' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#606080' }} domain={[0, 160]} />
                <Radar name="\u65B9\u6848\u4E00 (\u6700\u4F4E)" dataKey="t1" stroke="#ffd93d" fill="#ffd93d" fillOpacity={0.08} strokeWidth={2} />
                <Radar name="\u65B9\u6848\u4E8C (\u63A8\u8350)" dataKey="t2" stroke="#00e0a8" fill="#00e0a8" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="\u65B9\u6848\u4E09 (\u5B8C\u6574)" dataKey="t3" stroke="#4da6ff" fill="#4da6ff" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="\u539F\u8BBA\u6587" dataKey="paper" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost Comparison Chart */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u4E91\u670D\u52A1\u8D39\u7528\u5BF9\u6BD4</h3>
        <div className="card-grid card-grid-2">
          <div className="chart-container">
            <div className="chart-title">\u5404\u914D\u7F6E\u603B\u8BAD\u7EC3\u8D39\u7528 (USD)</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={costData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" />
                <XAxis dataKey="name" stroke="#606080" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606080" tick={{ fontSize: 12 }} label={{ value: 'USD', angle: -90, position: 'insideLeft', fill: '#606080', fontSize: 11 }} />
                <Tooltip content={<CostTooltip />} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {costData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-container">
            <div className="chart-title">\u5404\u914D\u7F6E\u8BAD\u7EC3\u5929\u6570</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={costData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" />
                <XAxis dataKey="name" stroke="#606080" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606080" tick={{ fontSize: 12 }} label={{ value: '\u5929', angle: -90, position: 'insideLeft', fill: '#606080', fontSize: 11 }} />
                <Tooltip content={<CostTooltip />} />
                <Bar dataKey="days" radius={[6, 6, 0, 0]}>
                  {costData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Smart Split Strategy */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u6700\u4F18\u7B56\u7565\uFF1ACPU + GPU \u5B9E\u4F8B\u5206\u79BB\u90E8\u7F72</h3>
        <div className="arch-diagram">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            \u6700\u4F73\u6027\u4EF7\u6BD4\uFF1A\u8BA1\u7B97\u89D2\u8272\u5206\u79BB
          </div>
          <div className="arch-flow">
            <div className="arch-stage env" style={{ minWidth: 260 }}>
              <h4 style={{ color: '#00e0a8' }}>CPU \u5B9E\u4F8B (Actor \u96C6\u7FA4)</h4>
              <p style={{ fontWeight: 700 }}>64\u2013128 vCPU\uFF0C128\u2013256 GB RAM</p>
              <p style={{ fontSize: 11 }}>20\u201330 \u4E2A Actor \u5BB9\u5668</p>
              <p style={{ fontSize: 11 }}>\u5982 AWS c6a.16xlarge ~$2.47/h</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ over VPC</div>
              </div>
            </div>
            <div className="arch-stage ppo" style={{ minWidth: 260 }}>
              <h4 style={{ color: '#b0a6ff' }}>GPU \u5B9E\u4F8B (Learner)</h4>
              <p style={{ fontWeight: 700 }}>4\u20138 vCPU\uFF0C16\u201332 GB RAM</p>
              <p style={{ fontSize: 11 }}>1\u00D7 \u6700\u4FBF\u5B9C\u7684 GPU (L4 / A10 / 4090)</p>
              <p style={{ fontSize: 11 }}>\u5982 AWS g6.xlarge ~$0.80/h</p>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00e0a8' }}>~$3.27/h</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>\u5408\u8BA1\u5C0F\u65F6\u8D39\u7528</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4da6ff' }}>~$2,350/\u6708</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>\u6708\u4ED8\u4F30\u7B97 (24/7)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ff9f43' }}>~60 \u5929</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>\u9884\u4F30\u8BAD\u7EC3\u65F6\u95F4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Services Table */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u4E91\u670D\u52A1\u9009\u578B\u53C2\u8003</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>\u5E73\u53F0</th><th>CPU \u5B9E\u4F8B</th><th>GPU \u5B9E\u4F8B</th><th>CPU \u8D39\u7528</th><th>GPU \u8D39\u7528</th><th>\u6708\u603B\u8D39</th><th>\u5730\u533A</th></tr>
            </thead>
            <tbody>
              {cloudServices.map(c => (
                <tr key={c.provider}>
                  <td style={{ fontWeight: 700, color: 'var(--text)' }}>{c.provider}</td>
                  <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono' }}>{c.cpu}</td>
                  <td style={{ fontSize: 12, fontFamily: 'JetBrains Mono' }}>{c.gpu}</td>
                  <td>{c.cpuCost}</td>
                  <td>{c.gpuCost}</td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{c.total}</td>
                  <td>{c.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phased Strategy */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>\u5EFA\u8BAE\u5206\u9636\u6BB5\u8BAD\u7EC3\u7B56\u7565</h3>
        <div className="card-grid card-grid-3">
          {[
            {
              phase: '\u7B2C\u4E00\u9636\u6BB5\uFF1A\u9A8C\u8BC1\u6D41\u7A0B',
              color: '#ffd93d',
              desc: '\u7528\u5F53\u524D\u786C\u4EF6 (4 \u6838\uFF0C\u65E0 GPU)\u3002\u8DD1 1\u20132 \u4E2A Actor + \u7EAF CPU Learner\u3002\u9A8C\u8BC1\u5168\u6D41\u7A0B\u80FD\u8DD1\u901A\u3002',
              cost: '\u514D\u8D39',
              time: '1\u20132 \u5468',
              goal: '\u4EE3\u7801\u80FD\u8DD1\u3001\u6570\u636E\u80FD\u6D41\u8F6C'
            },
            {
              phase: '\u7B2C\u4E8C\u9636\u6BB5\uFF1A\u5C0F\u89C4\u6A21\u8BD5\u8BAD',
              color: '#00e0a8',
              desc: '\u79DF\u4E00\u53F0 32 \u6838 + 1 GPU \u4E91\u670D\u52A1\u5668\uFF0C\u8DD1 1\u20132 \u5468\u3002\u542F\u52A8 8\u201310 \u4E2A Actor\uFF0C\u89C2\u5BDF loss \u66F2\u7EBF\u548C\u80DC\u7387\u8D8B\u52BF\u3002',
              cost: '~\u00A52,000\u20133,000',
              time: '1\u20132 \u5468',
              goal: '\u8BAD\u7EC3\u6536\u655B\u3001\u6307\u6807\u6539\u5584'
            },
            {
              phase: '\u7B2C\u4E09\u9636\u6BB5\uFF1A\u6B63\u5F0F\u8BAD\u7EC3',
              color: '#4da6ff',
              desc: '\u6839\u636E\u7B2C\u4E8C\u9636\u6BB5\u7ED3\u679C\u6269\u5230 64+ \u6838 + GPU\u3002\u8DD1 20+ Actor \u8BAD\u7EC3 2\u20133 \u4E2A\u6708\u3002\u6216\u7533\u8BF7\u5B66\u6821/\u5B9E\u9A8C\u5BA4\u96C6\u7FA4\u8D44\u6E90\u3002',
              cost: '~\u00A515,000\u201335,000',
              time: '2\u20133 \u4E2A\u6708',
              goal: '\u8BAD\u7EC3\u51FA\u6709\u7ADE\u4E89\u529B\u7684\u80DC\u7387\u6A21\u578B'
            },
          ].map(p => (
            <div className="card" key={p.phase} style={{ borderTop: `3px solid ${p.color}` }}>
              <h4 style={{ color: p.color, marginBottom: 8 }}>{p.phase}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '6px 8px', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u8D39\u7528</span>
                <span style={{ color: p.color, fontWeight: 700 }}>{p.cost}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u65F6\u95F4</span>
                <span>{p.time}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>\u76EE\u6807</span>
                <span>{p.goal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="card" style={{ borderTop: '3px solid #ff6b6b' }}>
        <h4 style={{ color: '#ff6b6b', marginBottom: 12 }}>&#x26A0; \u91CD\u8981\u524D\u63D0\uFF1ADQN \u9884\u8BAD\u7EC3\u6743\u91CD</h4>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
          DanZero+ \u7684 PPO \u8BAD\u7EC3\u9636\u6BB5<strong>\u5FC5\u987B</strong>\u4F9D\u8D56 DQN \u9884\u8BAD\u7EC3\u6743\u91CD\u3002
          DQN \u6A21\u578B\uFF08\u901A\u8FC7 Deep Monte Carlo \u8BAD\u7EC3\uFF0C\u539F\u8BBA\u6587\u7528\u4E86 81 \u4E2A Actor\uFF09\u8D1F\u8D23 Top-2 \u52A8\u4F5C\u7B5B\u9009\uFF0CPPO \u518D\u4ECE\u4E2D\u7CBE\u9009\u3002
          GitHub \u4ED3\u5E93\u4E2D<strong>\u672A\u63D0\u4F9B</strong>\u8FD9\u4E2A\u6743\u91CD\u6587\u4EF6\u3002\u53EF\u9009\u65B9\u6848\uFF1A
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
          {[
            '\u8054\u7CFB\u8BBA\u6587\u4F5C\u8005\u7D22\u8981 DQN checkpoint\uFF08\u6700\u5FEB\u9014\u5F84\uFF09',
            '\u7528 learner_n/ \u4ECE\u96F6\u8BAD\u7EC3 DQN\uFF08\u9700\u8981\u66F4\u591A\u7B97\u529B\uFF0C\u539F\u8BBA\u6587\u7528\u4E86 81 \u4E2A Actor\uFF09',
            '\u7528 OpenGuanDan benchmark \u5E73\u53F0\uFF0C\u5185\u542B\u9884\u8BAD\u7EC3 baseline',
          ].map((item, i) => (
            <li key={i} style={{ padding: '8px 0', fontSize: 14, color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: '#ff6b6b', marginRight: 8, fontWeight: 700 }}>{i + 1}.</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Line */}
      <div className="card" style={{ marginTop: 40, textAlign: 'center', padding: 40, background: 'linear-gradient(135deg, rgba(0,224,168,0.05), rgba(77,166,255,0.05))' }}>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>\u6838\u5FC3\u7ED3\u8BBA</div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.6 }}>
          \u628A\u9884\u7B97\u82B1\u5728 <span style={{ color: '#00e0a8' }}>CPU \u6838\u5FC3\u6570</span>\u4E0A\uFF0C\u800C\u4E0D\u662F GPU \u7B97\u529B\u3002
          <br />
          <span style={{ color: '#4da6ff' }}>$300 GPU + 64 \u6838 CPU</span> \u6BD4 <span style={{ color: '#ff6b6b' }}>$10/\u5C0F\u65F6\u7684 H100</span> \u66F4\u9002\u5408\u8FD9\u4E2A\u4EFB\u52A1\u3002
        </div>
      </div>
    </section>
  )
}
