import { useState } from 'react'
export default function Login({ onLogin }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true)
    setTimeout(() => {
      const ok = onLogin(pwd)
      if (!ok) { setError(true); setPwd('') }
      setLoading(false)
    }, 400)
  }
  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:'#0a0c10',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{background:'#13161e',border:'1px solid #1e2330',borderRadius:20,padding:'48px 40px',width:380,animation:'fadeIn .35s ease',boxShadow:'0 24px 64px rgba(0,0,0,.6)'}}>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{background:'#4f6ef7',borderRadius:16,width:52,height:52,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,margin:'0 auto 16px'}}>🖥️</div>
          <div style={{fontWeight:700,fontSize:20,color:'#edf0f7',letterSpacing:'-0.02em'}}>AssetManager</div>
          <div style={{fontSize:12,color:'#424d60',marginTop:4,textTransform:'uppercase',letterSpacing:'0.08em'}}>Accesso riservato</div>
        </div>
        <form onSubmit={handleSubmit} style={{animation:error?'shake .4s ease':'none'}}>
          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,color:'#8892a8',textTransform:'uppercase',letterSpacing:'.08em',display:'block',marginBottom:6,fontWeight:500}}>Password</label>
            <input type="password" value={pwd} onChange={e=>{setPwd(e.target.value);setError(false)}} placeholder="••••••••" autoFocus
              style={{width:'100%',background:'#0a0c10',border:`1.5px solid ${error?'#e03131':'#1e2330'}`,borderRadius:12,color:'#edf0f7',fontSize:16,padding:'12px 16px',letterSpacing:'0.15em',transition:'all .15s'}}/>
            {error&&<div style={{color:'#f87171',fontSize:12,marginTop:6}}>Password errata. Riprova.</div>}
          </div>
          <button type="submit" disabled={!pwd||loading}
            style={{width:'100%',background:pwd&&!loading?'#4f6ef7':'#1e2330',color:pwd&&!loading?'#fff':'#424d60',border:'none',borderRadius:12,padding:'13px 0',fontSize:14,fontWeight:600,cursor:pwd?'pointer':'default',transition:'all .2s',letterSpacing:'.01em'}}>
            {loading?'..':'→ Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
