const repos = [
  {
    rank: 1, name: 'DanZero+', tech: 'PPO + DQN', color: '#7c6cf0',
    repo: 'https://github.com/submit-paper/Danzero_plus',
    paper: 'https://arxiv.org/abs/2312.02561',
    desc: 'IEEE top journal. Two-stage hybrid: pretrained DQN narrows the search space, PPO selects final action. Trained 30 days on 160 CPUs + 1 GPU.',
    strength: 'State-of-the-art', difficulty: 'high',
    tags: ['RL', 'PPO', 'DQN', 'Distributed'],
  },
  {
    rank: 2, name: 'OpenGuanDan', tech: 'Benchmark', color: '#4da6ff',
    repo: 'https://github.com/GameAI-NJUPT/OpenGuanDan',
    paper: 'https://arxiv.org/html/2602.00676',
    desc: 'The most recent (2026) complete benchmarking platform. Supports rule-based AI, RL agents, and LLM integration. Independent API per player.',
    strength: 'Platform', difficulty: 'medium',
    tags: ['Benchmark', 'LLM', 'Multi-Agent'],
  },
  {
    rank: 3, name: 'DanZero', tech: 'Deep MC', color: '#00e0a8',
    repo: 'https://github.com/AltmanD/guandan_mcc',
    paper: 'https://arxiv.org/abs/2210.17087',
    desc: 'The first RL-based GuanDan AI. Uses Deep Monte Carlo method with distributed training. Beats 8 rule-based baselines, achieves human-level play.',
    strength: 'Strong', difficulty: 'high',
    tags: ['RL', 'Monte Carlo', 'Distributed'],
  },
  {
    rank: 4, name: 'guandan-ai', tech: 'Rule-Based', color: '#ffd93d',
    repo: 'https://github.com/QinlinChen/guandan-ai',
    desc: 'Clean, readable rule-based AI. Great for understanding GuanDan game logic and card combination handling. Good as a training baseline.',
    strength: 'Medium', difficulty: 'low',
    tags: ['Rule-Based', 'Beginner-Friendly'],
  },
  {
    rank: 5, name: 'AI-Card-Game-Guandan', tech: 'Rule + GUI', color: '#ff9f43',
    repo: 'https://github.com/flowermouse/AI-Card-Game-Guandan',
    desc: 'Nanjing University 2024 course project. Full game rules implementation with graphical interface. Play against AI directly.',
    strength: 'Medium', difficulty: 'low',
    tags: ['GUI', 'Python', 'Course Project'],
  },
]

const difficultyColor = { high: 'tag-red', medium: 'tag-yellow', low: 'tag-green' }
const strengthMap = { 'State-of-the-art': 'tag-blue', Strong: 'tag-green', Medium: 'tag-yellow', Platform: 'tag-blue' }

export default function RepoSurvey() {
  return (
    <section className="section">
      <h2 className="section-title"><span className="icon">&#x1F50D;</span> Top 5 GuanDan AI Repos</h2>
      <p className="section-sub">Ranked by technical sophistication and playing strength</p>

      <div className="card-grid" style={{ gap: 16 }}>
        {repos.map(r => (
          <div className="card" key={r.rank}>
            <div className="card-header">
              <div className="card-rank" style={{ background: r.color }}>{r.rank}</div>
              <div>
                <span className="card-title">{r.name}</span>
                <span className="card-tech" style={{ background: `${r.color}22`, color: r.color }}>{r.tech}</span>
              </div>
            </div>
            <div className="card-body">
              <p style={{ marginBottom: 12 }}>{r.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {r.tags.map(t => <span key={t} className="tag" style={{ background: 'var(--bg)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span className={`tag ${strengthMap[r.strength]}`}>{r.strength}</span>
                <span className={`tag ${difficultyColor[r.difficulty]}`}>Difficulty: {r.difficulty}</span>
                <a href={r.repo} target="_blank" rel="noreferrer">GitHub</a>
                {r.paper && <a href={r.paper} target="_blank" rel="noreferrer">Paper</a>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Comparison Table</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Repo</th><th>Method</th><th>Strength</th><th>Difficulty</th><th>Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                [1, 'DanZero+', 'PPO RL', 'State-of-the-art', 'High', 'Researchers / Advanced devs'],
                [2, 'OpenGuanDan', 'Benchmark', 'Multi-agent', 'Medium-High', 'Strategy comparison'],
                [3, 'DanZero', 'Deep MC', 'Strong', 'High', 'Paper reproduction'],
                [4, 'guandan-ai', 'Rule-based', 'Medium', 'Low', 'Beginners'],
                [5, 'AI-Card-Game', 'Rule+GUI', 'Medium', 'Low', 'Playing directly'],
              ].map(row => (
                <tr key={row[0]}>
                  {row.map((cell, i) => <td key={i} style={i === 0 ? { fontWeight: 700, color: 'var(--accent-light)' } : {}}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
