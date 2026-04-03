import { useState } from 'react'

export default function Login({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const ok = onLogin(pwd)
      if (!ok) { setError(true); setPwd('') }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono','Courier New',monospace",
      background: '#0d1117', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
      `}</style>
      <div style={{
        background: '#161b22', border: '1px solid #21262d', borderRadius: 16,
        padding: '48px 40px', width: 380, animation: 'fadeIn .35s ease',
        boxShadow: '0 24px 64px rgba(0,0,0,.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ background: '#1f6feb', borderRadius: 12, padding: '10px 14px', fontSize: 28, display: 'inline-block', marginBottom: 16 }}>🖥️</div>
          <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 600, fontSize: 20, color: '#e6edf3' }}>AssetManager</div>
          <div style={{ fontSize: 12, color: '#484f58', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Accesso riservato</div>
        </div>

        <form onSubmit={handleSubmit} style={{ animation: error ? 'shake .4s ease' : 'none' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={pwd}
              onChange={e => { setPwd(e.target.value); setError(false) }}
              placeholder="••••••••"
              autoFocus
              style={{
                width: '100%', background: '#0d1117', border: `1px solid ${error ? '#da3633' : '#30363d'}`,
                borderRadius: 8, color: '#e6edf3', fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 16, padding: '11px 14px', outline: 'none', transition: 'border .15s',
                letterSpacing: '0.15em'
              }}
            />
            {error && <div style={{ color: '#f85149', fontSize: 12, marginTop: 6 }}>Password errata. Riprova.</div>}
          </div>
          <button
            type="submit"
            disabled={!pwd || loading}
            style={{
              width: '100%', background: pwd && !loading ? '#238636' : '#21262d',
              color: pwd && !loading ? '#fff' : '#484f58', border: 'none',
              borderRadius: 8, padding: '12px 0', fontSize: 14, fontWeight: 500,
              fontFamily: "'IBM Plex Mono',monospace", cursor: pwd ? 'pointer' : 'default',
              transition: 'all .2s'
            }}
          >
            {loading ? '...' : '→ Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
