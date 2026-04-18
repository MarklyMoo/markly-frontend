import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook ──
function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15, ...opts });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Icons ──
const Ic = {
  Zap: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Globe: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Brain: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 015 5c0 .8-.2 1.6-.5 2.3A5 5 0 0119 14a5 5 0 01-3 4.6V22h-4v-3.4A5 5 0 019 14a5 5 0 012.5-4.7A5 5 0 0112 2z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>,
  Clock: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Shield: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Calendar: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Send: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Arrow: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg: #06080F;
  --bg2: #0A0E1A;
  --card: #0D1220;
  --border: #161D30;
  --text: #C8D1E0;
  --muted: #5A6580;
  --accent: #6C5CE7;
  --accent2: #00D2A0;
  --hot: #FF6B9D;
  --gold: #FFD93D;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); overflow-x: hidden; }

@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes glow { 0%,100%{opacity:.4} 50%{opacity:.8} }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
@keyframes countUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

.reveal { opacity: 0; transform: translateY(30px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
.reveal.visible { opacity: 1; transform: translateY(0); }

::selection { background: rgba(108,92,231,.4); }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

const FEATURES = [
  { icon: <Ic.Brain />, title: "Zero Marketing Knowledge", desc: "Just describe your business. AI handles strategy, copywriting, and channel selection automatically.", color: "#6C5CE7" },
  { icon: <Ic.Globe />, title: "Every Platform, One Click", desc: "Instagram, Facebook, TikTok, LinkedIn, X, Email, Google Ads — all generated from one input.", color: "#00D2A0" },
  { icon: <Ic.Clock />, title: "60 Seconds to Launch", desc: "From blank screen to a complete marketing plan with ready-to-post content in under a minute.", color: "#FF6B9D" },
  { icon: <Ic.Calendar />, title: "Smart Calendar", desc: "Schedule and plan your content visually. See your entire week at a glance.", color: "#FFD93D" },
  { icon: <Ic.Send />, title: "Auto-Post Queue", desc: "Connect your accounts and publish directly from Markly. No copy-pasting.", color: "#6C5CE7" },
  { icon: <Ic.Shield />, title: "Edit & Regenerate", desc: "Don't like a post? Edit inline or regenerate individual pieces without redoing everything.", color: "#00D2A0" },
];

const STEPS = [
  { num: "01", title: "Describe Your Business", desc: "Tell us your business name, what you do, and who you serve. That's it — no marketing jargon needed.", time: "10 sec" },
  { num: "02", title: "AI Builds Your Plan", desc: "Our AI analyzes your business and creates a complete marketing strategy with content for every channel.", time: "45 sec" },
  { num: "03", title: "Launch Everywhere", desc: "Copy, schedule, or auto-post your content. Edit anything you want. Regenerate what you don't like.", time: "5 sec" },
];

const REVIEWS = [
  { name: "Sarah K.", role: "Bakery Owner", text: "I used to spend 3 hours a week writing Instagram captions. Now it takes me 2 minutes. This is insane.", stars: 5 },
  { name: "Marcus T.", role: "Freelance Designer", text: "I've tried Hootsuite, Buffer, Later — they all assume you already know marketing. Markly doesn't. It just works.", stars: 5 },
  { name: "Priya M.", role: "Etsy Seller", text: "Generated my entire holiday marketing plan in one sitting. The email sequences are actually really good.", stars: 5 },
  { name: "James L.", role: "Fitness Coach", text: "The auto-post queue changed everything. I set it up once and my social media runs itself for the whole week.", stars: 5 },
];

const PRICING = [
  { id: "free", name: "Starter", price: 0, period: "forever", desc: "Test the waters", features: ["3 marketing plans", "All platforms included", "Copy & paste content", "Basic strategy"], cta: "Start Free", popular: false },
  { id: "pro", name: "Pro", price: 19, period: "/mo", desc: "For serious marketers", features: ["Unlimited plans", "Content calendar", "Auto-post queue", "Single-item regeneration", "Social account connections", "Priority AI generation"], cta: "Go Pro", popular: true },
  { id: "business", name: "Business", price: 49, period: "/mo", desc: "For teams & agencies", features: ["Everything in Pro", "Team collaboration", "White-label reports", "Custom brand voice", "API access", "Dedicated support"], cta: "Contact Us", popular: false },
];

const COMPARISONS = [
  { feature: "Marketing knowledge required", markly: "None", others: "Significant" },
  { feature: "Time to first campaign", markly: "60 seconds", others: "2-4 hours" },
  { feature: "Platforms covered", markly: "All major ones", others: "1-3 usually" },
  { feature: "Content creation", markly: "AI-generated & ready", others: "You write it" },
  { feature: "Starting price", markly: "Free", others: "$29-97/mo" },
  { feature: "Learning curve", markly: "Zero", others: "Days to weeks" },
];

// ── Section wrapper ──
function Section({ children, id, bg }) {
  const [ref, vis] = useInView();
  return (
    <section id={id} ref={ref} className={`reveal ${vis ? "visible" : ""}`}
      style={{ padding: "80px 20px", maxWidth: 1100, margin: "0 auto", position: "relative", background: bg || "transparent" }}>
      {children}
    </section>
  );
}

function SectionTitle({ tag, title, desc }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 48 }}>
      {tag && <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "var(--accent)", background: "rgba(108,92,231,.12)", padding: "6px 16px", borderRadius: 20, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 14 }}>{tag}</div>}
      <h2 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>{title}</h2>
      {desc && <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>{desc}</p>}
    </div>
  );
}

// ── Main App ──
export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWaitlist = () => {
    if (email.includes("@")) { setSubmitted(true); }
  };

  return (
    <div style={{ fontFamily: "'Instrument Sans', sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <style>{CSS}</style>

      {/* ══════ NAV ══════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "14px 20px",
        background: scrolled ? "rgba(6,8,15,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all .3s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #6C5CE7, #00D2A0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>M</div>
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff" }}>Markly</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {["Features", "How it Works", "Pricing"].map(t => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, "-")}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", transition: "color .2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "var(--muted)"}>{t}</a>
            ))}
            <a href="#waitlist" style={{
              fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--accent)", padding: "8px 18px", borderRadius: 8,
              textDecoration: "none", transition: "transform .15s",
            }} onMouseEnter={e => e.target.style.transform = "translateY(-1px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Get Early Access
            </a>
          </div>
        </div>
      </nav>

      {/* ══════ HERO ══════ */}
      <div style={{ position: "relative", overflow: "hidden", paddingTop: 120, paddingBottom: 80 }}>
        {/* Mesh background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 70% 50% at 30% 30%, rgba(108,92,231,.10) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 70% 60%, rgba(0,210,160,.07) 0%, transparent 60%)" }} />
        {/* Grid lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: .04, backgroundImage: "linear-gradient(var(--muted) 1px, transparent 1px), linear-gradient(90deg, var(--muted) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(108,92,231,.1)", border: "1px solid rgba(108,92,231,.2)", borderRadius: 30, padding: "7px 18px 7px 8px", marginBottom: 28, animation: "fadeUp .6s ease-out" }}>
            <span style={{ background: "var(--accent)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 12 }}>NEW</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>AI-powered marketing for everyone</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(38px, 7vw, 72px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif",
            lineHeight: 1.05, letterSpacing: "-.03em", color: "#fff", marginBottom: 20,
            animation: "fadeUp .7s ease-out .1s both",
          }}>
            Your entire marketing.<br />
            <span style={{ background: "linear-gradient(135deg, #6C5CE7 0%, #00D2A0 50%, #FF6B9D 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              One simple input.
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--muted)", maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.6, animation: "fadeUp .7s ease-out .2s both" }}>
            Describe your business in plain English. Markly's AI generates ready-to-launch posts, emails, and ads for every platform — in 60 seconds.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, animation: "fadeUp .7s ease-out .3s both" }}>
            <a href="#waitlist" style={{
              display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", borderRadius: 14,
              background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)", color: "#fff", fontSize: 17, fontWeight: 700,
              textDecoration: "none", boxShadow: "0 8px 32px rgba(108,92,231,.35)", transition: "transform .15s, box-shadow .15s",
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }} onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 40px rgba(108,92,231,.5)"; }}
               onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 8px 32px rgba(108,92,231,.35)"; }}>
              Get Early Access — It's Free <Ic.Arrow />
            </a>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>No credit card required · Free forever plan available</span>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 52, animation: "fadeUp .7s ease-out .4s both" }}>
            {[{ n: "60s", l: "To full plan" }, { n: "8+", l: "Platforms" }, { n: "$0", l: "To start" }].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ PROBLEM ══════ */}
      <Section id="problem">
        <SectionTitle tag="The Problem" title="Marketing tools weren't built for you." desc="They were built for marketing teams with degrees and budgets. You just need customers." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {[
            { emoji: "😤", problem: "Hootsuite, HubSpot, Kartra", pain: "Require hours to learn. Dashboards with 50+ tabs. You need a marketing degree just to get started." },
            { emoji: "💸", problem: "$29–97/month minimum", pain: "Most tools lock basic features behind expensive plans. You're paying before you earn." },
            { emoji: "⏰", problem: "Hours per week", pain: "Writing captions, designing emails, planning campaigns — it eats your time that should go to your actual business." },
          ].map(item => (
            <div key={item.problem} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{item.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.problem}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{item.pain}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ FEATURES ══════ */}
      <Section id="features">
        <SectionTitle tag="Features" title="Everything you need. Nothing you don't." desc="Markly replaces your entire marketing stack with one simple tool powered by AI." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 28,
              transition: "border-color .3s, transform .3s",
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = f.color + "40"; e.currentTarget.style.transform = "translateY(-4px)"; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color + "15", color: f.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</div>
              <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ HOW IT WORKS ══════ */}
      <Section id="how-it-works">
        <SectionTitle tag="How It Works" title="3 steps. 60 seconds. Done." desc="No tutorials. No onboarding calls. No marketing expertise needed." />
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} style={{ display: "flex", gap: 28, alignItems: "flex-start", padding: "32px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 52, fontWeight: 900, fontFamily: "'Bricolage Grotesque', sans-serif", color: "var(--accent)", opacity: .2, lineHeight: 1, flexShrink: 0 }}>{s.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.title}</div>
                <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--accent2)", background: "rgba(0,210,160,.1)", padding: "4px 12px", borderRadius: 8 }}>
                  <Ic.Clock /> {s.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ COMPARISON ══════ */}
      <Section id="comparison">
        <SectionTitle tag="Why Markly" title="How we compare to everything else." />
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 18, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "16px 24px", borderBottom: "1px solid var(--border)", background: "rgba(108,92,231,.06)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Feature</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", textAlign: "center" }}>Markly</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", textAlign: "center" }}>Others</div>
          </div>
          {COMPARISONS.map((c, i) => (
            <div key={c.feature} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < COMPARISONS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{c.feature}</div>
              <div style={{ fontSize: 13, color: "var(--accent2)", fontWeight: 700, textAlign: "center" }}>{c.markly}</div>
              <div style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>{c.others}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ TESTIMONIALS ══════ */}
      <Section id="testimonials">
        <SectionTitle tag="What People Say" title="Loved by real business owners." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16 }}>
          {REVIEWS.map(r => (
            <div key={r.name} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                {Array.from({ length: r.stars }).map((_, i) => <span key={i} style={{ color: "var(--gold)" }}><Ic.Star /></span>)}
              </div>
              <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>"{r.text}"</p>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ PRICING ══════ */}
      <Section id="pricing">
        <SectionTitle tag="Pricing" title="Simple pricing. No surprises." desc="Start free. Upgrade when you're ready." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, alignItems: "start" }}>
          {PRICING.map(p => (
            <div key={p.id} style={{
              background: "var(--card)", border: p.popular ? "2px solid var(--accent)" : "1px solid var(--border)",
              borderRadius: 18, padding: 28, position: "relative",
              transform: p.popular ? "scale(1.03)" : "none",
            }}>
              {p.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 12 }}>MOST POPULAR</div>}
              <div style={{ marginTop: p.popular ? 8 : 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{p.desc}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>${p.price}</span>
                  <span style={{ fontSize: 14, color: "var(--muted)" }}>{p.period}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--text)" }}>
                      <span style={{ color: "var(--accent2)" }}><Ic.Check /></span>{f}
                    </div>
                  ))}
                </div>
                <a href="#waitlist" style={{
                  display: "block", textAlign: "center", padding: "14px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14,
                  background: p.popular ? "linear-gradient(135deg, #6C5CE7, #8B5CF6)" : "transparent",
                  border: p.popular ? "none" : "1.5px solid var(--border)",
                  color: p.popular ? "#fff" : "var(--text)",
                  boxShadow: p.popular ? "0 6px 24px rgba(108,92,231,.3)" : "none",
                  transition: "transform .15s",
                }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  {p.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ══════ WAITLIST CTA ══════ */}
      <Section id="waitlist">
        <div style={{
          background: "linear-gradient(135deg, rgba(108,92,231,.1), rgba(0,210,160,.06))",
          border: "1px solid rgba(108,92,231,.2)", borderRadius: 24, padding: "60px 32px", textAlign: "center",
        }}>
          {!submitted ? (
            <>
              <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff", marginBottom: 10 }}>
                Ready to automate your marketing?
              </h2>
              <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 28, maxWidth: 460, margin: "0 auto 28px" }}>
                Join the early access list. Be the first to try Markly when we launch.
              </p>
              <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
                <input
                  type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{
                    flex: 1, minWidth: 200, padding: "14px 18px", borderRadius: 12, border: "1px solid var(--border)",
                    background: "var(--bg)", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--accent)"} onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
                <button onClick={handleWaitlist} style={{
                  padding: "14px 28px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #6C5CE7, #8B5CF6)", color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(108,92,231,.3)", transition: "transform .15s",
                }} onMouseEnter={e => e.target.style.transform = "translateY(-2px)"} onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                  Join Waitlist
                </button>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14 }}>Free forever plan. No credit card. Cancel anytime.</p>
            </>
          ) : (
            <div style={{ animation: "fadeUp .5s ease-out" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff", marginBottom: 10 }}>You're on the list!</h2>
              <p style={{ fontSize: 16, color: "var(--muted)" }}>We'll notify you as soon as Markly is ready. Get ready to automate your marketing.</p>
            </div>
          )}
        </div>
      </Section>

      {/* ══════ FOOTER ══════ */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "40px 20px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6C5CE7, #00D2A0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", fontFamily: "'Bricolage Grotesque', sans-serif" }}>M</div>
            <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif", color: "#fff" }}>Markly</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>© 2026 Markly. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
