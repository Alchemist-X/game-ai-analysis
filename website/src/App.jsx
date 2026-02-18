import { useState } from 'react'
import './App.css'
import RepoSurvey from './components/RepoSurvey'
import Architecture from './components/Architecture'
import Environment from './components/Environment'
import VsPioSolver from './components/VsPioSolver'
import Hardware from './components/Hardware'

const tabs = [
  { id: 'repos', label: 'AI Repos' },
  { id: 'arch', label: 'DanZero+ Architecture' },
  { id: 'env', label: 'Environment' },
  { id: 'vs', label: 'vs PioSolver' },
  { id: 'hw', label: 'Hardware' },
]

export default function App() {
  const [active, setActive] = useState('repos')

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <span style={{ fontWeight: 800, fontSize: 15, marginRight: 12, color: 'var(--accent-light)' }}>
            GuanDan AI
          </span>
          <a href="./zh/" style={{ marginLeft: 0, marginRight: 8, color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none' }}>中文</a>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`nav-btn ${active === t.id ? 'active' : ''}`}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="app">
        <header className="hero">
          <div className="hero-badge">DanZero+ Deep Dive</div>
          <h1>GuanDan AI Research</h1>
          <p>DanZero+ DQN+PPO Hybrid RL Architecture, Environment Benchmark, PioSolver Comparison</p>
        </header>

        {active === 'repos' && <RepoSurvey />}
        {active === 'arch' && <Architecture />}
        {active === 'env' && <Environment />}
        {active === 'vs' && <VsPioSolver />}
        {active === 'hw' && <Hardware />}
      </div>
    </>
  )
}
