import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const costData = [
  { name: 'H100 (Lambda)', monthly: 1800, days: 150, total: 9000, actors: 8, color: '#ff6b6b' },
  { name: 'H100 (AWS p5)', monthly: 7900, days: 90, total: 23700, actors: 15, color: '#ff9f43' },
  { name: 'A10G+64CPU', monthly: 2950, days: 60, total: 5900, actors: 20, color: '#4da6ff' },
  { name: 'L4+64CPU Split', monthly: 2350, days: 60, total: 4700, actors: 20, color: '#00e0a8' },
  { name: 'CN 4090+CPU', monthly: 700, days: 100, total: 2300, actors: 10, color: '#b0a6ff' },
]

const cpuCompare = [
  { name: 'Current\n4C EPYC', cores: 4, threads: 8, actors: 1, score: 5 },
  { name: 'Ryzen 9\n7950X', cores: 16, threads: 32, actors: 8, score: 25 },
  { name: 'EPYC\n9354P 32C', cores: 32, threads: 64, actors: 20, score: 50 },
  { name: 'TR 7970X\n32C', cores: 32, threads: 64, actors: 20, score: 50 },
  { name: 'Dual EPYC\n128C', cores: 128, threads: 256, actors: 40, score: 100 },
]

const gpuCompare = [
  { name: 'RTX 3060', vram: 12, tflops: 12.7, price: 300, overkill: '50x' },
  { name: 'RTX 4060', vram: 8, tflops: 15.1, price: 300, overkill: '60x' },
  { name: 'RTX 4090', vram: 24, tflops: 82.6, price: 1600, overkill: '330x' },
  { name: 'A10G', vram: 24, tflops: 31.2, price: 'Cloud', overkill: '125x' },
  { name: 'A100', vram: 40, tflops: 77.9, price: 'Cloud', overkill: '310x' },
  { name: 'H100', vram: 80, tflops: 989, price: 'Cloud', overkill: '3960x' },
]

const tierData = [
  { subject: 'CPU Cores', t1: 16, t2: 64, t3: 128, paper: 160 },
  { subject: 'GPU Power', t1: 80, t2: 80, t3: 80, paper: 80 },
  { subject: 'RAM (GB)', t1: 30, t2: 60, t3: 95, paper: 100 },
  { subject: 'Actors', t1: 20, t2: 50, t3: 95, paper: 100 },
  { subject: 'Speed', t1: 10, t2: 40, t3: 95, paper: 100 },
  { subject: 'Cost Efficiency', t1: 100, t2: 70, t3: 40, paper: 20 },
]

const cloudServices = [
  { provider: 'AWS', cpu: 'c6a.16xlarge (64 vCPU)', gpu: 'g6.xlarge (1\u00D7L4)', cpuCost: '$2.47/h', gpuCost: '$0.80/h', total: '~$2,350/mo', region: 'US' },
  { provider: 'GCP', cpu: 'c3-highcpu-88 (88 vCPU)', gpu: 'g2-standard-4 (1\u00D7L4)', cpuCost: '$3.20/h', gpuCost: '$0.84/h', total: '~$2,900/mo', region: 'US/EU' },
  { provider: 'Lambda Labs', cpu: '\u2014', gpu: 'gpu_1x_a100 (30 vCPU)', cpuCost: '\u2014', gpuCost: '$1.10/h', total: '~$800/mo', region: 'US' },
  { provider: 'Alibaba Cloud', cpu: 'ecs.g7.16xlarge', gpu: 'GPU instance', cpuCost: '\u00A58/h', gpuCost: '\u00A512/h', total: '~\u00A514,400/mo', region: 'CN' },
  { provider: 'AutoDL', cpu: 'Bundled', gpu: 'RTX 4090 instance', cpuCost: '\u2014', gpuCost: '\u00A52\u20133/h', total: '~\u00A53,000/mo', region: 'CN' },
]

const CostTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div style={{ background: '#1a1a2e', border: '1px solid #2a2a48', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
      <div style={{ color: '#4da6ff' }}>Monthly: ${d?.monthly?.toLocaleString()}</div>
      <div style={{ color: '#00e0a8' }}>Training Days: ~{d?.days}</div>
      <div style={{ color: '#ff9f43' }}>Total Cost: ${d?.total?.toLocaleString()}</div>
      <div style={{ color: '#b0a6ff' }}>Parallel Actors: {d?.actors}</div>
    </div>
  )
}

export default function Hardware() {
  return (
    <section className="section">
      <h2 className="section-title"><span className="icon">&#x1F5A5;</span> Hardware Requirements</h2>
      <p className="section-sub">CPU-bound distributed training: what hardware you actually need for DanZero+</p>

      {/* Key Insight */}
      <div className="card" style={{ borderTop: '3px solid #ff9f43', marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ fontSize: 36 }}>&#x26A0;</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Key Insight: CPU is the Bottleneck, Not GPU</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
              DanZero+ has only <strong style={{ color: 'var(--accent-light)' }}>2.65M parameters (~10 MB)</strong> — thousands of times smaller than modern LLMs.
              The GPU (Learner) finishes each PPO update in milliseconds and spends most of its time <em>waiting for data</em>.
              The real bottleneck is <strong style={{ color: '#ff9f43' }}>CPU cores running parallel game simulations</strong> (Actors).
              More CPU cores = more parallel games = faster data generation = faster training.
            </p>
          </div>
        </div>
      </div>

      {/* Original Paper Setup */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Original Paper Training Setup</h3>
        <div className="arch-diagram">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            Distributed Architecture (41 Actor Machines + 1 GPU Learner)
          </div>
          <div className="arch-flow">
            <div className="arch-stage env" style={{ minWidth: 240 }}>
              <h4 style={{ color: '#00e0a8' }}>41 Actor Containers</h4>
              <p>4 players/container = 164 processes</p>
              <p style={{ fontSize: 11 }}>CPU-only, 8 threads each</p>
              <p style={{ fontSize: 11 }}>0.7 GB RAM limit per actor</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Port 5000/5001</div>
              </div>
            </div>
            <div className="arch-stage ppo" style={{ minWidth: 240 }}>
              <h4 style={{ color: '#b0a6ff' }}>1 GPU Learner</h4>
              <p>PPO training on GPU</p>
              <p style={{ fontSize: 11 }}>Batch 2048, 20 grad steps</p>
              <p style={{ fontSize: 11 }}>Trains per 13 data batches</p>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, textAlign: 'center' }}>
            {[
              { label: 'Total CPUs', value: '~160 cores', color: '#00e0a8' },
              { label: 'GPU', value: '1\u00D7 (any)', color: '#b0a6ff' },
              { label: 'Training Time', value: '~30 days', color: '#ff9f43' },
              { label: 'Parallel Games', value: '41 simultaneous', color: '#4da6ff' },
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
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>CPU Requirements: The Critical Resource</h3>
        <div className="card-grid card-grid-2">
          <div className="card">
            <h4 style={{ color: '#00e0a8', marginBottom: 12 }}>Per-Actor Resource Consumption</h4>
            <div className="table-wrap">
              <table>
                <tbody>
                  {[
                    ['Processes', '~10', 'danserver + 4 game + 4 player + watchdog'],
                    ['CPU Threads', '8', 'torch.set_num_threads(8) per actor'],
                    ['RAM (hard cap)', '0.7 GB', 'Auto-restart if exceeded'],
                    ['Ports Used', '5', '23456 (WS) + 6000-6003 (ZMQ)'],
                    ['Inference Mode', 'CPU only', 'CUDA_VISIBLE_DEVICES=-1'],
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
            <h4 style={{ color: '#4da6ff', marginBottom: 12 }}>CPU Scaling Analysis</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>CPU</th><th>Cores</th><th>Max Actors</th><th>vs Paper</th></tr>
                </thead>
                <tbody>
                  {cpuCompare.map(c => (
                    <tr key={c.name}>
                      <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{c.name.replace('\n', ' ')}</td>
                      <td style={{ fontWeight: 700 }}>{c.cores}C/{c.threads}T</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-light)' }}>{c.actors}</td>
                      <td>{c.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
              Rule of thumb: 1 Actor needs ~2-4 dedicated CPU cores for optimal throughput
            </p>
          </div>
        </div>
      </div>

      {/* GPU Analysis */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>GPU Requirements: Any Modern GPU Works</h3>
        <div className="card" style={{ borderTop: '3px solid #00e0a8' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ fontSize: 36 }}>&#x1F4A1;</div>
            <div>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
                The model uses only <strong style={{ color: 'var(--accent-light)' }}>~10 MB VRAM</strong> and each PPO update takes microseconds of GPU time.
                Even a <strong>$300 RTX 3060</strong> provides 50x more power than needed.
                An H100 ($10+/hr) wastes <strong>99.99%</strong> of its 80GB VRAM and 989 TFLOPS on this workload.
              </p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>GPU</th><th>VRAM</th><th>TFLOPS (FP32)</th><th>Price</th><th>Overkill Factor</th></tr>
              </thead>
              <tbody>
                {gpuCompare.map(g => (
                  <tr key={g.name}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{g.name}</td>
                    <td>{g.vram} GB</td>
                    <td>{g.tflops}</td>
                    <td>{typeof g.price === 'number' ? `$${g.price}` : g.price}</td>
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
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommended Hardware Tiers</h3>
        <div className="card-grid card-grid-2">
          <div>
            <div className="card-grid" style={{ gap: 16 }}>
              {[
                {
                  tier: 'Tier 1: Minimum Viable',
                  color: '#ffd93d',
                  cpu: 'AMD Ryzen 9 7950X (16C/32T)',
                  gpu: 'RTX 3060 12GB / RTX 4060',
                  ram: '64 GB DDR5',
                  actors: '4\u20138 actors',
                  time: '~150\u2013300 days',
                  cost: '~$1,000',
                  use: 'Code verification, small-scale experiments'
                },
                {
                  tier: 'Tier 2: Recommended',
                  color: '#00e0a8',
                  cpu: 'AMD EPYC 9354P (32C/64T) or Threadripper 7970X',
                  gpu: 'RTX 4070 12GB',
                  ram: '128 GB DDR5 ECC',
                  actors: '16\u201320 actors',
                  time: '~60\u201380 days',
                  cost: '~$2,500\u2013$3,000',
                  use: 'Serious research, hyperparameter tuning'
                },
                {
                  tier: 'Tier 3: Full Reproduction',
                  color: '#4da6ff',
                  cpu: '2\u00D7 AMD EPYC 9554 (128C/256T dual socket)',
                  gpu: 'RTX 4070 / A4000',
                  ram: '256 GB DDR5 ECC',
                  actors: '40+ actors',
                  time: '~30\u201335 days',
                  cost: '~$9,500\u2013$10,000',
                  use: 'Full paper reproduction, large-scale experiments'
                },
              ].map(t => (
                <div className="card" key={t.tier} style={{ borderLeft: `4px solid ${t.color}` }}>
                  <h4 style={{ color: t.color, marginBottom: 12 }}>{t.tier}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '8px 12px', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>CPU</span>
                    <span style={{ color: 'var(--text)' }}>{t.cpu}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>GPU</span>
                    <span style={{ color: 'var(--text)' }}>{t.gpu}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>RAM</span>
                    <span style={{ color: 'var(--text)' }}>{t.ram}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Actors</span>
                    <span style={{ color: 'var(--accent-light)', fontWeight: 700 }}>{t.actors}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Time</span>
                    <span style={{ color: 'var(--text)' }}>{t.time}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cost</span>
                    <span style={{ color: t.color, fontWeight: 700 }}>{t.cost}</span>
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Best for: {t.use}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-title">Hardware Tier Comparison (Radar)</div>
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={tierData} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
                <PolarGrid stroke="#1c1c30" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9090b0' }} />
                <PolarRadiusAxis tick={{ fontSize: 10, fill: '#606080' }} domain={[0, 160]} />
                <Radar name="Tier 1 (Minimum)" dataKey="t1" stroke="#ffd93d" fill="#ffd93d" fillOpacity={0.08} strokeWidth={2} />
                <Radar name="Tier 2 (Recommended)" dataKey="t2" stroke="#00e0a8" fill="#00e0a8" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Tier 3 (Full)" dataKey="t3" stroke="#4da6ff" fill="#4da6ff" fillOpacity={0.1} strokeWidth={2} />
                <Radar name="Original Paper" dataKey="paper" stroke="#ff6b6b" fill="#ff6b6b" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost Comparison Chart */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cloud Cost Comparison</h3>
        <div className="card-grid card-grid-2">
          <div className="chart-container">
            <div className="chart-title">Total Training Cost by Configuration</div>
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
            <div className="chart-title">Training Days by Configuration</div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={costData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c30" />
                <XAxis dataKey="name" stroke="#606080" tick={{ fontSize: 11 }} />
                <YAxis stroke="#606080" tick={{ fontSize: 12 }} label={{ value: 'Days', angle: -90, position: 'insideLeft', fill: '#606080', fontSize: 11 }} />
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
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Optimal Strategy: Split CPU + GPU Instances</h3>
        <div className="arch-diagram">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
            Best Price-Performance: Separate Compute Roles
          </div>
          <div className="arch-flow">
            <div className="arch-stage env" style={{ minWidth: 260 }}>
              <h4 style={{ color: '#00e0a8' }}>CPU Instance (Actors)</h4>
              <p style={{ fontWeight: 700 }}>64\u2013128 vCPU, 128\u2013256 GB RAM</p>
              <p style={{ fontSize: 11 }}>20\u201330 Actor containers</p>
              <p style={{ fontSize: 11 }}>e.g. AWS c6a.16xlarge ~$2.47/h</p>
            </div>
            <div className="arch-arrow">
              <div style={{ textAlign: 'center' }}>
                <div>&#x2194;</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ZMQ over VPC</div>
              </div>
            </div>
            <div className="arch-stage ppo" style={{ minWidth: 260 }}>
              <h4 style={{ color: '#b0a6ff' }}>GPU Instance (Learner)</h4>
              <p style={{ fontWeight: 700 }}>4\u20138 vCPU, 16\u201332 GB RAM</p>
              <p style={{ fontSize: 11 }}>1\u00D7 cheapest GPU (L4 / A10 / 4090)</p>
              <p style={{ fontSize: 11 }}>e.g. AWS g6.xlarge ~$0.80/h</p>
            </div>
          </div>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#00e0a8' }}>~$3.27/h</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Combined hourly cost</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#4da6ff' }}>~$2,350/mo</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Monthly estimate (24/7)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#ff9f43' }}>~60 days</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Estimated training time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Services Table */}
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Cloud Service Options</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Provider</th><th>CPU Instance</th><th>GPU Instance</th><th>CPU Cost</th><th>GPU Cost</th><th>Total/Month</th><th>Region</th></tr>
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
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recommended Phased Approach</h3>
        <div className="card-grid card-grid-3">
          {[
            {
              phase: 'Phase 1: Validate',
              color: '#ffd93d',
              desc: 'Use current hardware (4 cores, no GPU). Run 1\u20132 Actors with CPU-only Learner. Verify the full pipeline works end-to-end.',
              cost: 'Free',
              time: '1\u20132 weeks',
              goal: 'Code runs, data flows correctly'
            },
            {
              phase: 'Phase 2: Small Trial',
              color: '#00e0a8',
              desc: 'Rent a 32-core + 1 GPU cloud instance for 1\u20132 weeks. Run 8\u201310 Actors. Monitor loss curves and win-rate trends.',
              cost: '~$300\u2013500',
              time: '1\u20132 weeks',
              goal: 'Training converges, metrics improve'
            },
            {
              phase: 'Phase 3: Full Training',
              color: '#4da6ff',
              desc: 'Scale to 64+ cores + GPU based on Phase 2 results. Run 20+ Actors for 2\u20133 months. Or apply for university/lab cluster access.',
              cost: '$2,000\u20135,000',
              time: '2\u20133 months',
              goal: 'Trained model with competitive win-rate'
            },
          ].map(p => (
            <div className="card" key={p.phase} style={{ borderTop: `3px solid ${p.color}` }}>
              <h4 style={{ color: p.color, marginBottom: 8 }}>{p.phase}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '6px 8px', fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cost</span>
                <span style={{ color: p.color, fontWeight: 700 }}>{p.cost}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Time</span>
                <span>{p.time}</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Goal</span>
                <span>{p.goal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="card" style={{ borderTop: '3px solid #ff6b6b' }}>
        <h4 style={{ color: '#ff6b6b', marginBottom: 12 }}>&#x26A0; Critical Prerequisite: DQN Pretrained Weights</h4>
        <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.8 }}>
          DanZero+ requires <strong>pretrained DQN weights</strong> to run the PPO training stage.
          The DQN model (trained via Deep Monte Carlo with 81 Actor containers) provides the Top-2 action selection that PPO refines.
          These weights are <strong>not included</strong> in the GitHub repository. Options:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 12 }}>
          {[
            'Contact the paper authors to request pretrained DQN checkpoint (fastest path)',
            'Train DQN from scratch using learner_n/ (requires even more CPU: 81 Actors in original setup)',
            'Start with OpenGuanDan benchmark framework which includes pretrained baselines',
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
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Bottom Line</div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.6 }}>
          Spend your budget on <span style={{ color: '#00e0a8' }}>CPU cores</span>, not GPU power.
          <br />
          A <span style={{ color: '#4da6ff' }}>$300 GPU + 64-core CPU</span> outperforms an <span style={{ color: '#ff6b6b' }}>$10/hr H100</span> for this workload.
        </div>
      </div>
    </section>
  )
}
