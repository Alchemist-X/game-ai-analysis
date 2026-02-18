import { useState } from 'react'
import './App.css'
import RepoSurvey from './components/RepoSurvey'
import Architecture from './components/Architecture'
import Environment from './components/Environment'
import VsPioSolver from './components/VsPioSolver'

const tabs = [
  { id: 'repos', label: '开源项目' },
  { id: 'arch', label: '核心架构' },
  { id: 'env', label: '环境评估' },
  { id: 'vs', label: '对比 PioSolver' },
]

export default function App() {
  const [active, setActive] = useState('repos')

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span style={{ fontWeight: 800, fontSize: 15, marginRight: 12, color: 'var(--accent-light)' }}>
            掼蛋 AI
          </span>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
          <a href="../" style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>English</a>
        </div>
      </nav>

      <div className="app">
        <header className="hero">
          <div className="hero-badge">DanZero+ 深度解析</div>
          <h1>掼蛋 AI 策略研究</h1>
          <p>DanZero+ DQN+PPO 混合 RL 架构 | 环境基准测试 | PioSolver 对比分析</p>
        </header>

        {active === 'repos' && <RepoSurvey />}
        {active === 'arch' && <Architecture />}
        {active === 'env' && <Environment />}
        {active === 'vs' && <VsPioSolver />}
      </div>
    </>
  )
}
