import { useState, useEffect } from 'react'
import Login from './Login.jsx'
import AssetManager from './AssetManager.jsx'

const APP_PASSWORD = import.meta.env.VITE_APP_PASSWORD || 'asset2024'
const SESSION_KEY = 'am_auth'

export default function App() {
  const [authed, setAuthed] = useState(false)
  useEffect(() => { if (sessionStorage.getItem(SESSION_KEY) === 'ok') setAuthed(true) }, [])
  const handleLogin = (pwd) => {
    if (pwd === APP_PASSWORD) { sessionStorage.setItem(SESSION_KEY, 'ok'); setAuthed(true); return true }
    return false
  }
  const handleLogout = () => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false) }
  if (!authed) return <Login onLogin={handleLogin} />
  return <AssetManager onLogout={handleLogout} />
}
