import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// ── Backend URL ──
const API = 'https://markly-api-byal.onrender.com';

// ── API helper ──
async function api(path, opts = {}) {
  const token = localStorage.getItem('markly-token');
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  try {
    const r = await fetch(`${API}${path}`, { ...opts, headers: { ...headers, ...opts.headers } });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Request failed');
    return data;
  } catch (e) { console.error(e); throw e; }
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const copy = (t) => navigator.clipboard && navigator.clipboard.writeText(t);

// ── Icons ──
const I = {
  Spark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Back: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Copy: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Social: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A3 3 0 1018 2a3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Mail: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Ad: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Globe: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Clock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

// ── Config ──
const CHANNELS = [
  { id:"instagram", label:"Instagram" }, { id:"facebook", label:"Facebook" },
  { id:"tiktok", label:"TikTok" }, { id:"twitter", label:"X / Twitter" },
  { id:"linkedin", label:"LinkedIn" }, { id:"email", label:"Email" },
  { id:"google_ads", label:"Google Ads" }, { id:"pinterest", label:"Pinterest" },
];
const AUDIENCES = ["Young adults (18-25)","Professionals (25-40)","Parents & families","Small business owners","Seniors (55+)","Gen Z & teens","Everyone / General"];
const pColor = (p) => {
  if (!p) return "#818CF8";
  const map = { instagram:"#E1306C", facebook:"#1877F2", tiktok:"#00F2EA", twitter:"#1DA1F2", linkedin:"#0A66C2", email:"#34D399", google:"#FBBC05", pinterest:"#E60023" };
  for (const [k,v] of Object.entries(map)) { if (p.toLowerCase().includes(k)) return v; }
  return "#818CF8";
};

// ── Styles ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,800&family=Outfit:wght@600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
input:focus,textarea:focus{border-color:#818CF8!important;outline:none}
::selection{background:rgba(129,140,248,.3)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1E293B;border-radius:4px}
`;
const $ = {
  input: { width:"100%",padding:"13px 14px",borderRadius:11,border:"1px solid #1E293B",background:"#0F172A",color:"#E8ECF4",fontSize:15,outline:"none",boxSizing:"border-box",fontFamily:"inherit" },
  textarea: { width:"100%",padding:"13px 14px",borderRadius:11,border:"1px solid #1E293B",background:"#0F172A",color:"#E8ECF4",fontSize:15,outline:"none",resize:"vertical",minHeight:90,lineHeight:1.5,boxSizing:"border-box",fontFamily:"inherit" },
  chip: (on) => ({ display:"inline-flex",alignItems:"center",gap:5,padding:"9px 14px",borderRadius:20,border:on?"1.5px solid #818CF8":"1.5px solid #1E293B",background:on?"rgba(129,140,248,.12)":"#0F172A",color:on?"#A5B4FC":"#94A3B8",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all .2s",userSelect:"none" }),
  label: { fontSize:11,fontWeight:600,color:"#64748B",textTransform:"uppercase",letterSpacing:".06em",marginBottom:7 },
  card: { background:"rgba(15,23,42,.85)",border:"1px solid #1E293B",borderRadius:14,padding:16,marginBottom:12,animation:"fadeUp .35s ease-out both" },
  btn: { display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,padding:"14px 28px",borderRadius:13,border:"none",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,.3)",fontFamily:"inherit",textDecoration:"none" },
  btnFull: { display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",padding:"14px",borderRadius:13,border:"none",background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,.3)",fontFamily:"inherit" },
  btnGhost: { display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px 16px",borderRadius:10,border:"1.5px solid #1E293B",background:"transparent",color:"#94A3B8",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" },
  sm: { display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:7,border:"1px solid #1E293B",background:"transparent",color:"#64748B",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:"inherit" },
  dot: (a, d) => ({ width:28,height:4,borderRadius:2,background:d?"#34D399":a?"#818CF8":"#1E293B",transition:"all .3s" }),
};

function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  return <button style={$.sm} onClick={() => { copy(text); setC(true); setTimeout(()=>setC(false),1200); }}>{c?<I.Check/>:<I.Copy/>}{c?"Copied":"Copy"}</button>;
}
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div style={{ position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:200,background:"#34D399",color:"#0B0F1A",padding:"10px 20px",borderRadius:10,fontSize:13,fontWeight:700,animation:"fadeUp .25s ease-out",fontFamily:"'DM Sans',sans-serif" }}>{msg}</div>;
}
function Logo({ size = 36 }) {
  return (
    <div style={{ display:"inline-flex",alignItems:"center",gap:10 }}>
      <div style={{ width:size,height:size,borderRadius:size*.3,background:"linear-gradient(135deg,#6366F1,#34D399)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.48,fontWeight:900,color:"#fff",fontFamily:"'Outfit',sans-serif" }}>M</div>
      <span style={{ fontSize:size*.6,fontWeight:800,fontFamily:"'Outfit',sans-serif",color:"#fff" }}>Markly</span>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  LANDING PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function LandingPage({ onGetStarted, onLogin }) {
  const features = [
    { icon: <I.Zap />, title: "Zero Marketing Knowledge", desc: "Just describe your business. AI handles strategy, copywriting, and channel selection.", color: "#6366F1" },
    { icon: <I.Globe />, title: "Every Platform, One Click", desc: "Instagram, Facebook, TikTok, LinkedIn, X, Email, Google Ads — all from one input.", color: "#34D399" },
    { icon: <I.Clock />, title: "60 Seconds to Launch", desc: "From blank screen to complete marketing plan with ready-to-post content.", color: "#F472B6" },
  ];

  const reviews = [
    { name: "Sarah K.", role: "Bakery Owner", text: "I used to spend 3 hours a week on Instagram. Now it takes 2 minutes.", stars: 5 },
    { name: "Marcus T.", role: "Freelance Designer", text: "Other tools assume you know marketing. Markly doesn't. It just works.", stars: 5 },
    { name: "Priya M.", role: "Etsy Seller", text: "Generated my entire holiday marketing plan in one sitting.", stars: 5 },
  ];

  return (
    <div style={{ background:"#0B0F1A",color:"#E8ECF4",minHeight:"100vh" }}>
      {/* Background */}
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse 70% 50% at 30% 30%,rgba(99,102,241,.08) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 70% 60%,rgba(16,185,129,.06) 0%,transparent 60%)" }} />
      <div style={{ position:"fixed",inset:0,pointerEvents:"none",opacity:.03,backgroundImage:"linear-gradient(#64748B 1px,transparent 1px),linear-gradient(90deg,#64748B 1px,transparent 1px)",backgroundSize:"60px 60px" }} />

      {/* Nav */}
      <nav style={{ position:"sticky",top:0,zIndex:100,padding:"14px 24px",background:"rgba(11,15,26,.9)",backdropFilter:"blur(16px)",borderBottom:"1px solid #111827" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <Logo size={32} />
          <div style={{ display:"flex",alignItems:"center",gap:16 }}>
            <button onClick={onLogin} style={{ background:"none",border:"none",color:"#94A3B8",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Log in</button>
            <button onClick={onGetStarted} style={{ ...$.btn,padding:"10px 20px",fontSize:14 }}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"80px 24px 60px",textAlign:"center" }}>
        <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(99,102,241,.1)",border:"1px solid rgba(99,102,241,.2)",borderRadius:30,padding:"7px 18px 7px 8px",marginBottom:28 }}>
          <span style={{ background:"#6366F1",color:"#fff",fontSize:10,fontWeight:800,padding:"3px 8px",borderRadius:12 }}>NEW</span>
          <span style={{ fontSize:13,fontWeight:600,color:"#818CF8" }}>AI-powered marketing for everyone</span>
        </div>
        <h1 style={{ fontSize:"clamp(36px,6vw,64px)",fontWeight:800,fontFamily:"'Outfit',sans-serif",lineHeight:1.08,letterSpacing:"-.03em",color:"#fff",marginBottom:20 }}>
          Your entire marketing.<br/>
          <span style={{ background:"linear-gradient(135deg,#818CF8 0%,#34D399 50%,#F472B6 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>One simple input.</span>
        </h1>
        <p style={{ fontSize:"clamp(16px,2vw,20px)",color:"#94A3B8",maxWidth:560,margin:"0 auto 36px",lineHeight:1.6 }}>
          Describe your business in plain English. Markly's AI generates ready-to-launch posts, emails, and ads for every platform — in 60 seconds.
        </p>
        <div style={{ display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap" }}>
          <button onClick={onGetStarted} style={{ ...$.btn,padding:"16px 36px",fontSize:17,fontFamily:"'Outfit',sans-serif" }}>
            Get Started — It's Free <I.Arrow />
          </button>
        </div>
        <p style={{ fontSize:13,color:"#475569",marginTop:14 }}>No credit card required</p>
        <div style={{ display:"flex",justifyContent:"center",gap:48,marginTop:48 }}>
          {[{n:"60s",l:"To full plan"},{n:"8+",l:"Platforms"},{n:"$0",l:"To start"}].map(s=>(
            <div key={s.l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:32,fontWeight:800,color:"#fff",fontFamily:"'Outfit',sans-serif" }}>{s.n}</div>
              <div style={{ fontSize:12,color:"#64748B",fontWeight:600,marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"40px 24px 80px" }}>
        <h2 style={{ fontSize:"clamp(26px,4vw,38px)",fontWeight:800,fontFamily:"'Outfit',sans-serif",color:"#fff",textAlign:"center",marginBottom:12 }}>Everything you need. Nothing you don't.</h2>
        <p style={{ fontSize:16,color:"#64748B",textAlign:"center",marginBottom:48,maxWidth:500,margin:"0 auto 48px" }}>Markly replaces your entire marketing stack with one simple tool.</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16 }}>
          {features.map(f=>(
            <div key={f.title} style={{ background:"rgba(15,23,42,.8)",border:"1px solid #1E293B",borderRadius:16,padding:28 }}>
              <div style={{ width:48,height:48,borderRadius:12,background:f.color+"15",color:f.color,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>{f.icon}</div>
              <div style={{ fontSize:18,fontWeight:700,color:"#fff",marginBottom:8,fontFamily:"'Outfit',sans-serif" }}>{f.title}</div>
              <div style={{ fontSize:14,color:"#94A3B8",lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"40px 24px 80px" }}>
        <h2 style={{ fontSize:"clamp(26px,4vw,38px)",fontWeight:800,fontFamily:"'Outfit',sans-serif",color:"#fff",textAlign:"center",marginBottom:48 }}>3 steps. 60 seconds. Done.</h2>
        {[{n:"01",t:"Describe Your Business",d:"Tell us your business name, what you do, and who you serve. No marketing jargon needed."},{n:"02",t:"AI Builds Your Plan",d:"Our AI creates a complete marketing strategy with content for every channel you selected."},{n:"03",t:"Launch Everywhere",d:"Copy, schedule, or auto-post your content. Edit anything. Regenerate what you don't like."}].map((s,i)=>(
          <div key={s.n} style={{ display:"flex",gap:24,alignItems:"flex-start",padding:"28px 0",borderBottom:i<2?"1px solid #1E293B":"none",maxWidth:700,margin:"0 auto" }}>
            <div style={{ fontSize:48,fontWeight:900,fontFamily:"'Outfit',sans-serif",color:"#6366F1",opacity:.2,lineHeight:1,flexShrink:0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize:20,fontWeight:700,color:"#fff",marginBottom:6,fontFamily:"'Outfit',sans-serif" }}>{s.t}</div>
              <div style={{ fontSize:14,color:"#94A3B8",lineHeight:1.6 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"40px 24px 80px" }}>
        <h2 style={{ fontSize:"clamp(26px,4vw,38px)",fontWeight:800,fontFamily:"'Outfit',sans-serif",color:"#fff",textAlign:"center",marginBottom:48 }}>Loved by business owners</h2>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16 }}>
          {reviews.map(r=>(
            <div key={r.name} style={{ background:"rgba(15,23,42,.8)",border:"1px solid #1E293B",borderRadius:16,padding:24 }}>
              <div style={{ display:"flex",gap:3,marginBottom:12 }}>{Array.from({length:r.stars}).map((_,i)=><span key={i} style={{color:"#FFD93D"}}><I.Star/></span>)}</div>
              <p style={{ fontSize:14,color:"#CBD5E1",lineHeight:1.6,marginBottom:16,fontStyle:"italic" }}>"{r.text}"</p>
              <div style={{ fontSize:14,fontWeight:700,color:"#fff" }}>{r.name}</div>
              <div style={{ fontSize:12,color:"#64748B" }}>{r.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth:700,margin:"0 auto",padding:"20px 24px 80px" }}>
        <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,.1),rgba(52,211,153,.06))",border:"1px solid rgba(99,102,241,.2)",borderRadius:24,padding:"60px 32px",textAlign:"center" }}>
          <h2 style={{ fontSize:"clamp(24px,4vw,36px)",fontWeight:800,fontFamily:"'Outfit',sans-serif",color:"#fff",marginBottom:12 }}>Ready to automate your marketing?</h2>
          <p style={{ fontSize:16,color:"#94A3B8",marginBottom:28 }}>Join thousands of business owners who market smarter, not harder.</p>
          <button onClick={onGetStarted} style={{ ...$.btn,padding:"16px 36px",fontSize:17 }}>Get Started — It's Free <I.Arrow /></button>
          <p style={{ fontSize:12,color:"#475569",marginTop:14 }}>Free forever plan · No credit card required</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop:"1px solid #1E293B",padding:"30px 24px",maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
        <Logo size={24} />
        <div style={{ fontSize:12,color:"#475569" }}>© 2026 Markly. All rights reserved.</div>
      </footer>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
//  MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function App() {
  const [view, setView] = useState("landing"); // landing | auth | app
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState("signup");
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [page, setPage] = useState("home");
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [bizName, setBizName] = useState("");
  const [bizDesc, setBizDesc] = useState("");
  const [audience, setAudience] = useState("");
  const [channels, setChannels] = useState([]);

  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [dashTab, setDashTab] = useState("social");
  const [editId, setEditId] = useState(null);
  const [editTxt, setEditTxt] = useState("");

  const loadMsgs = ["Analyzing your business...","Crafting brand voice...","Generating social posts...","Writing emails...","Building ad campaigns...","Finalizing plan..."];
  const [loadIdx, setLoadIdx] = useState(0);
  useEffect(() => { if (!loading) return; const t = setInterval(()=>setLoadIdx(i=>(i+1)%loadMsgs.length), 2200); return ()=>clearInterval(t); }, [loading]);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('markly-token');
    if (token) {
      api('/api/auth/me').then(data => {
        setUser(data.user);
        setView("app");
        return api('/api/plans');
      }).then(data => {
        setPlans(data.plans || []);
      }).catch(() => {
        localStorage.removeItem('markly-token');
      });
    }
  }, []);

  const handleSignup = async () => {
    if (!authName.trim()||!authEmail.trim()||!authPass.trim()) { setAuthError("All fields required"); return; }
    if (authPass.length < 6) { setAuthError("Password must be 6+ characters"); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const data = await api('/api/auth/signup', { method:'POST', body:JSON.stringify({ name:authName.trim(), email:authEmail.trim(), password:authPass }) });
      localStorage.setItem('markly-token', data.token);
      setUser(data.user); setView("app"); setToast("Welcome to Markly!");
    } catch(e) { setAuthError(e.message||"Signup failed"); }
    setAuthLoading(false);
  };
  const handleLogin = async () => {
    if (!authEmail.trim()||!authPass.trim()) { setAuthError("Email and password required"); return; }
    setAuthLoading(true); setAuthError("");
    try {
      const data = await api('/api/auth/login', { method:'POST', body:JSON.stringify({ email:authEmail.trim(), password:authPass }) });
      localStorage.setItem('markly-token', data.token);
      setUser(data.user); setView("app");
      try { const p = await api('/api/plans'); setPlans(p.plans||[]); } catch {}
      setToast("Welcome back!");
    } catch(e) { setAuthError(e.message||"Invalid credentials"); }
    setAuthLoading(false);
  };
  const handleLogout = () => { setUser(null); setPlans([]); localStorage.removeItem('markly-token'); setView("landing"); setPage("home"); };

  const toggleCh = (id) => setChannels(p=>p.includes(id)?p.filter(c=>c!==id):[...p,id]);
  const canNext = () => step===0?bizName.trim()&&bizDesc.trim():step===1?!!audience:channels.length>0;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await api('/api/plans/generate', { method:'POST', body:JSON.stringify({ name:bizName, description:bizDesc, audience, channels:channels.map(id=>CHANNELS.find(c=>c.id===id)?.label) }) });
      const plan = data.plan;
      if (typeof plan.results === 'string') plan.results = JSON.parse(plan.results);
      setPlans(p=>[plan,...p]); setActivePlan(plan); setDashTab("social"); setPage("plan");
      setBizName(""); setBizDesc(""); setAudience(""); setChannels([]); setStep(0);
      setToast("Plan generated!");
    } catch(e) { setToast(e.message||"Generation failed"); }
    setLoading(false);
  };

  const saveEditFn = async (planId, section, idx, field) => {
    const plan = plans.find(p=>p.id===planId); if (!plan) return;
    const results = {...plan.results}; results[section]=[...results[section]]; results[section][idx]={...results[section][idx],[field]:editTxt};
    const update = p=>p.id===planId?{...p,results}:p;
    setPlans(ps=>ps.map(update));
    if (activePlan?.id===planId) setActivePlan({...activePlan,results});
    setEditId(null);
    try { await api(`/api/plans/${planId}`, { method:'PATCH', body:JSON.stringify({results}) }); setToast("Saved"); } catch { setToast("Save failed"); }
  };
  const deletePlan = async (planId) => {
    setPlans(p=>p.filter(x=>x.id!==planId)); if (activePlan?.id===planId) setPage("home");
    try { await api(`/api/plans/${planId}`, { method:'DELETE' }); } catch {}
  };

  // ── LANDING PAGE ──
  if (view === "landing") {
    return (
      <>
        <style>{CSS}</style>
        <LandingPage onGetStarted={()=>{setAuthPage("signup");setView("auth");}} onLogin={()=>{setAuthPage("login");setView("auth");}} />
      </>
    );
  }

  // ── AUTH PAGE ──
  if (view === "auth") {
    return (
      <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0B0F1A",color:"#E8ECF4",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
        <style>{CSS}</style>
        <div style={{ position:"fixed",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse 60% 50% at 20% 20%,rgba(99,102,241,.08) 0%,transparent 70%),radial-gradient(ellipse 50% 60% at 80% 80%,rgba(16,185,129,.06) 0%,transparent 70%)" }} />
        {toast && <Toast msg={toast} onDone={()=>setToast("")} />}
        <div style={{ position:"relative",zIndex:1,width:"100%",maxWidth:420,animation:"fadeUp .5s ease-out" }}>
          <div style={{ textAlign:"center",marginBottom:32,cursor:"pointer" }} onClick={()=>setView("landing")}><Logo size={36} /></div>
          <div style={{ background:"rgba(15,23,42,.8)",border:"1px solid #1E293B",borderRadius:20,padding:"36px 28px" }}>
            {authPage==="login" ? (
              <>
                <h2 style={{ fontSize:24,fontWeight:800,textAlign:"center",marginBottom:6,fontFamily:"'Outfit',sans-serif" }}>Welcome back</h2>
                <p style={{ fontSize:13,color:"#64748B",textAlign:"center",marginBottom:28 }}>Sign in to your account</p>
                <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                  <div><div style={$.label}>Email</div><input style={$.input} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} /></div>
                  <div><div style={$.label}>Password</div><div style={{position:"relative"}}><input style={{...$.input,paddingRight:44}} type={showPass?"text":"password"} placeholder="••••••" value={authPass} onChange={e=>setAuthPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()} /><button style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748B",cursor:"pointer"}} onClick={()=>setShowPass(!showPass)}>{showPass?<I.EyeOff/>:<I.Eye/>}</button></div></div>
                  {authError&&<div style={{fontSize:12,color:"#F87171",background:"rgba(239,68,68,.1)",padding:"8px 12px",borderRadius:8}}>{authError}</div>}
                  <button style={{...$.btnFull,opacity:authLoading?.6:1}} onClick={handleLogin} disabled={authLoading}>{authLoading?"Signing in...":"Sign In"}</button>
                </div>
                <p style={{fontSize:13,color:"#64748B",textAlign:"center",marginTop:20}}>Don't have an account? <span style={{color:"#A5B4FC",cursor:"pointer",fontWeight:600}} onClick={()=>{setAuthPage("signup");setAuthError("");}}>Sign up</span></p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize:24,fontWeight:800,textAlign:"center",marginBottom:6,fontFamily:"'Outfit',sans-serif" }}>Create your account</h2>
                <p style={{ fontSize:13,color:"#64748B",textAlign:"center",marginBottom:28 }}>Start marketing smarter today</p>
                <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
                  <div><div style={$.label}>Full Name</div><input style={$.input} placeholder="Your name" value={authName} onChange={e=>setAuthName(e.target.value)} /></div>
                  <div><div style={$.label}>Email</div><input style={$.input} type="email" placeholder="you@example.com" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} /></div>
                  <div><div style={$.label}>Password</div><div style={{position:"relative"}}><input style={{...$.input,paddingRight:44}} type={showPass?"text":"password"} placeholder="6+ characters" value={authPass} onChange={e=>setAuthPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSignup()} /><button style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#64748B",cursor:"pointer"}} onClick={()=>setShowPass(!showPass)}>{showPass?<I.EyeOff/>:<I.Eye/>}</button></div></div>
                  {authError&&<div style={{fontSize:12,color:"#F87171",background:"rgba(239,68,68,.1)",padding:"8px 12px",borderRadius:8}}>{authError}</div>}
                  <button style={{...$.btnFull,opacity:authLoading?.6:1}} onClick={handleSignup} disabled={authLoading}>{authLoading?"Creating...":(<><I.Spark /> Create Account — Free</>)}</button>
                </div>
                <p style={{fontSize:13,color:"#64748B",textAlign:"center",marginTop:20}}>Already have an account? <span style={{color:"#A5B4FC",cursor:"pointer",fontWeight:600}} onClick={()=>{setAuthPage("login");setAuthError("");}}>Sign in</span></p>
              </>
            )}
          </div>
          <p style={{ textAlign:"center",marginTop:16,fontSize:12,color:"#475569",cursor:"pointer" }} onClick={()=>setView("landing")}>← Back to home</p>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0B0F1A",color:"#E8ECF4",minHeight:"100vh" }}>
      <style>{CSS}</style>
      <div style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none",background:"radial-gradient(ellipse 60% 50% at 20% 20%,rgba(99,102,241,.08) 0%,transparent 70%),radial-gradient(ellipse 50% 60% at 80% 80%,rgba(16,185,129,.06) 0%,transparent 70%)" }} />
      {toast && <Toast msg={toast} onDone={()=>setToast("")} />}

      <div style={{ position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",padding:"0 20px",paddingBottom:80 }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,paddingBottom:10,borderBottom:"1px solid #111827" }}>
          <div onClick={()=>setPage("home")} style={{cursor:"pointer"}}><Logo size={28} /></div>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            {user?.plan!=="free"&&<span style={{fontSize:10,fontWeight:700,color:"#F472B6",background:"rgba(244,114,182,.1)",padding:"3px 8px",borderRadius:8,textTransform:"uppercase"}}>{user.plan}</span>}
            <div style={{width:32,height:32,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#EC4899)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,fontWeight:800,color:"#fff"}} onClick={()=>setPage("settings")}>{user?.name?.charAt(0).toUpperCase()}</div>
          </div>
        </div>

        {/* Home */}
        {page==="home"&&!loading&&(
          <div style={{paddingTop:28,animation:"fadeUp .4s ease-out"}}>
            <div style={{fontSize:15,color:"#94A3B8",marginBottom:4}}>Hey {user?.name?.split(" ")[0]}</div>
            <h1 style={{fontSize:28,fontWeight:800,lineHeight:1.1,fontFamily:"'Outfit',sans-serif",marginBottom:24}}><span style={{background:"linear-gradient(135deg,#818CF8,#34D399)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>What are we marketing today?</span></h1>
            <button style={$.btnFull} onClick={()=>{setStep(0);setPage("create");}}><I.Plus /> Create New Plan</button>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:20}}>
              <div style={{...$.card,textAlign:"center",padding:"14px"}}><div style={{fontSize:22,fontWeight:800,color:"#818CF8"}}>{plans.length}</div><div style={{fontSize:10,color:"#64748B",fontWeight:600}}>Plans</div></div>
              <div style={{...$.card,textAlign:"center",padding:"14px"}}><div style={{fontSize:22,fontWeight:800,color:"#34D399"}}>{user?.plan==='free'?'Free':user?.plan?.toUpperCase()}</div><div style={{fontSize:10,color:"#64748B",fontWeight:600}}>Plan</div></div>
            </div>
            {plans.length>0&&(
              <div style={{marginTop:20}}>
                <div style={{...$.label,marginBottom:12}}>Your Plans</div>
                {plans.map(p=>(<div key={p.id} style={{...$.card,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}} onClick={()=>{const plan=typeof p.results==='string'?{...p,results:JSON.parse(p.results)}:p;setActivePlan(plan);setDashTab("social");setPage("plan");}}><div><div style={{fontSize:14,fontWeight:700}}>{p.name}</div><div style={{fontSize:11,color:"#64748B",marginTop:2}}>{(p.channels||[]).length} channels</div></div><I.Arrow /></div>))}
              </div>
            )}
          </div>
        )}

        {/* Create */}
        {page==="create"&&!loading&&(
          <div style={{paddingTop:24,animation:"fadeUp .4s ease-out"}}>
            <div style={{display:"flex",gap:5,marginBottom:24}}>{["Business","Audience","Channels"].map((l,i)=><div key={l} style={$.dot(i===step,i<step)} />)}</div>
            {step===0&&(<div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{fontSize:20,fontWeight:800,fontFamily:"'Outfit',sans-serif"}}>Tell us about your business</div><div><div style={$.label}>Business Name</div><input style={$.input} placeholder="e.g. Fresh Bakes Co." value={bizName} onChange={e=>setBizName(e.target.value)} /></div><div><div style={$.label}>Description</div><textarea style={$.textarea} placeholder="What does your business do?" value={bizDesc} onChange={e=>setBizDesc(e.target.value)} /></div></div>)}
            {step===1&&(<div><div style={{fontSize:20,fontWeight:800,fontFamily:"'Outfit',sans-serif",marginBottom:14}}>Who are your customers?</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{AUDIENCES.map(a=><div key={a} style={$.chip(audience===a)} onClick={()=>setAudience(a)}>{audience===a&&<I.Check />}{a}</div>)}</div></div>)}
            {step===2&&(<div><div style={{fontSize:20,fontWeight:800,fontFamily:"'Outfit',sans-serif",marginBottom:14}}>Select your channels</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{CHANNELS.map(ch=><div key={ch.id} style={$.chip(channels.includes(ch.id))} onClick={()=>toggleCh(ch.id)}>{channels.includes(ch.id)&&<I.Check />}{ch.label}</div>)}</div></div>)}
            <div style={{display:"flex",gap:10,marginTop:28}}>
              <button style={$.btnGhost} onClick={()=>step>0?setStep(step-1):setPage("home")}><I.Back /> {step>0?"Back":"Home"}</button>
              <button style={{...$.btnFull,opacity:canNext()?1:.4,pointerEvents:canNext()?"auto":"none"}} onClick={()=>step<2?setStep(step+1):handleGenerate()}>{step===2?<><I.Spark /> Generate</>:<>Continue <I.Arrow /></>}</button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",gap:24}}><div style={{position:"relative",width:64,height:64}}><div style={{position:"absolute",inset:0,borderRadius:"50%",background:"conic-gradient(from 0deg,#6366F1,#8B5CF6,#EC4899,#34D399,#6366F1)",animation:"spin 2s linear infinite",opacity:.3}} /><div style={{position:"absolute",inset:5,borderRadius:"50%",background:"#0B0F1A",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Spark /></div></div><div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:700,marginBottom:5}}>Building your plan</div><div style={{fontSize:13,color:"#818CF8",fontWeight:500}}>{loadMsgs[loadIdx]}</div></div></div>)}

        {/* Plan View */}
        {page==="plan"&&activePlan&&!loading&&(
          <div style={{paddingTop:16,animation:"fadeUp .4s ease-out"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{cursor:"pointer",display:"flex",alignItems:"center",gap:5,color:"#64748B",fontSize:12}} onClick={()=>setPage("home")}><I.Back /> Home</div>
              <button style={{...$.sm,color:"#EF4444",borderColor:"rgba(239,68,68,.2)"}} onClick={()=>deletePlan(activePlan.id)}>Delete</button>
            </div>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"'Outfit',sans-serif"}}>{activePlan.name}</div>
            <div style={{fontSize:11,color:"#64748B",marginTop:2,marginBottom:14}}>{activePlan.audience}</div>

            {activePlan.results?.strategy&&(<div style={{...$.card,background:"linear-gradient(135deg,rgba(99,102,241,.06),rgba(52,211,153,.04))",border:"1px solid rgba(129,140,248,.15)",marginBottom:16}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:7}}><I.Spark /><span style={{fontSize:12,fontWeight:700,color:"#A5B4FC"}}>Strategy</span></div><div style={{fontSize:13,color:"#CBD5E1",lineHeight:1.55,marginBottom:8}}>{activePlan.results.strategy.summary}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}><span style={{fontSize:10,color:"#34D399",background:"rgba(52,211,153,.1)",padding:"3px 8px",borderRadius:8}}>{activePlan.results.strategy.tone}</span><span style={{fontSize:10,color:"#818CF8",background:"rgba(129,140,248,.1)",padding:"3px 8px",borderRadius:8}}>{activePlan.results.strategy.posting_frequency}</span></div></div>)}

            <div style={{display:"flex",gap:3,background:"#0F172A",borderRadius:11,padding:3,marginBottom:14}}>
              {[{id:"social",icon:<I.Social />,l:"Social"},{id:"email",icon:<I.Mail />,l:"Email"},{id:"ads",icon:<I.Ad />,l:"Ads"}].map(t=>(<button key={t.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"8px",borderRadius:8,border:"none",background:dashTab===t.id?"rgba(129,140,248,.14)":"transparent",color:dashTab===t.id?"#A5B4FC":"#475569",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setDashTab(t.id)}>{t.icon}{t.l}</button>))}
            </div>

            {dashTab==="social"&&activePlan.results?.social_posts?.map((post,i)=>(<div key={i} style={$.card}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:700,color:pColor(post.platform)}}>{post.platform}</span>{post.type&&<span style={{fontSize:9,fontWeight:600,color:"#34D399",background:"rgba(52,211,153,.1)",padding:"2px 7px",borderRadius:10}}>{post.type}</span>}</div>{editId===`s-${i}`?(<div><textarea style={{...$.textarea,minHeight:70}} value={editTxt} onChange={e=>setEditTxt(e.target.value)} /><div style={{display:"flex",gap:5,marginTop:6}}><button style={$.sm} onClick={()=>saveEditFn(activePlan.id,"social_posts",i,"content")}><I.Check /> Save</button><button style={$.sm} onClick={()=>setEditId(null)}>Cancel</button></div></div>):(<div style={{fontSize:13,color:"#CBD5E1",lineHeight:1.55,whiteSpace:"pre-wrap"}}>{post.content}</div>)}{post.best_time&&<div style={{fontSize:10,color:"#475569",marginTop:5}}>{post.best_time}</div>}<div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}><CopyBtn text={post.content} /><button style={$.sm} onClick={()=>{setEditId(`s-${i}`);setEditTxt(post.content);}}><I.Edit /> Edit</button></div></div>))}

            {dashTab==="email"&&activePlan.results?.email_sequences?.map((em,i)=>(<div key={i} style={$.card}><div style={{fontSize:11,fontWeight:700,color:"#64748B",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{em.name}</div><div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{em.subject}</div><div style={{fontSize:11,color:"#818CF8",fontStyle:"italic",marginBottom:8}}>{em.preview}</div>{editId===`e-${i}`?(<div><textarea style={{...$.textarea,minHeight:100}} value={editTxt} onChange={e=>setEditTxt(e.target.value)} /><div style={{display:"flex",gap:5,marginTop:6}}><button style={$.sm} onClick={()=>saveEditFn(activePlan.id,"email_sequences",i,"body")}><I.Check /> Save</button><button style={$.sm} onClick={()=>setEditId(null)}>Cancel</button></div></div>):(<div style={{fontSize:13,color:"#CBD5E1",lineHeight:1.55,whiteSpace:"pre-wrap"}}>{em.body}</div>)}<div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}><CopyBtn text={`Subject: ${em.subject}\n\n${em.body}`} /><button style={$.sm} onClick={()=>{setEditId(`e-${i}`);setEditTxt(em.body);}}><I.Edit /> Edit</button></div></div>))}

            {dashTab==="ads"&&activePlan.results?.ad_copy?.map((ad,i)=>(<div key={i} style={$.card}><div style={{fontSize:11,fontWeight:700,color:pColor(ad.platform),marginBottom:5}}>{ad.platform}</div><div style={{fontSize:14,fontWeight:700,color:"#F472B6",marginBottom:5}}>{ad.headline}</div>{editId===`a-${i}`?(<div><textarea style={{...$.textarea,minHeight:70}} value={editTxt} onChange={e=>setEditTxt(e.target.value)} /><div style={{display:"flex",gap:5,marginTop:6}}><button style={$.sm} onClick={()=>saveEditFn(activePlan.id,"ad_copy",i,"body")}><I.Check /> Save</button><button style={$.sm} onClick={()=>setEditId(null)}>Cancel</button></div></div>):(<div style={{fontSize:13,color:"#CBD5E1",lineHeight:1.55,whiteSpace:"pre-wrap"}}>{ad.body}</div>)}<div style={{display:"inline-block",marginTop:8,padding:"6px 14px",borderRadius:7,background:"linear-gradient(135deg,#6366F1,#8B5CF6)",color:"#fff",fontSize:11,fontWeight:700}}>{ad.cta}</div>{ad.targeting_tip&&<div style={{fontSize:10,color:"#475569",marginTop:6}}>Targeting: {ad.targeting_tip}</div>}<div style={{display:"flex",gap:5,marginTop:8,flexWrap:"wrap"}}><CopyBtn text={`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`} /><button style={$.sm} onClick={()=>{setEditId(`a-${i}`);setEditTxt(ad.body);}}><I.Edit /> Edit</button></div></div>))}
          </div>
        )}

        {/* Settings */}
        {page==="settings"&&(
          <div style={{paddingTop:16,animation:"fadeUp .4s ease-out"}}>
            <div style={{fontSize:18,fontWeight:800,fontFamily:"'Outfit',sans-serif",marginBottom:18}}>Settings</div>
            <div style={$.card}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#6366F1,#EC4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff"}}>{user?.name?.charAt(0)}</div><div><div style={{fontSize:16,fontWeight:700}}>{user?.name}</div><div style={{fontSize:12,color:"#64748B"}}>{user?.email}</div></div></div></div>
            <div style={$.card}><div style={{fontSize:14,fontWeight:700}}>Plan: {user?.plan==='free'?'Free':user?.plan?.charAt(0).toUpperCase()+user?.plan?.slice(1)}</div><div style={{fontSize:11,color:"#64748B"}}>{plans.length} plans created</div></div>
            <button style={{...$.btnGhost,width:"100%",marginTop:16,color:"#EF4444",borderColor:"rgba(239,68,68,.2)"}} onClick={handleLogout}><I.Logout /> Sign Out</button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:50,background:"rgba(11,15,26,.95)",borderTop:"1px solid #111827",backdropFilter:"blur(12px)"}}>
        <div style={{maxWidth:700,margin:"0 auto",display:"flex",justifyContent:"space-around",padding:"6px 0 10px"}}>
          {[{id:"home",icon:<I.Home />,l:"Home"},{id:"create",icon:<I.Plus />,l:"Create"},{id:"settings",icon:<I.Settings />,l:"Settings"}].map(n=>(<button key={n.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,border:"none",background:"none",color:page===n.id?"#A5B4FC":"#475569",fontSize:9,fontWeight:600,cursor:"pointer",padding:"3px 10px",fontFamily:"inherit"}} onClick={()=>{if(n.id==="create")setStep(0);setPage(n.id);}}>{n.icon}{n.l}</button>))}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
