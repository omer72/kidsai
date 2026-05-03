'use client';

import { useState } from 'react';
import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { IOSStatusBar } from './primitives';

// ─── Welcome ─────────────────────────────────────────────────────────────────

export function WelcomeScreen({ onStart, T }: { onStart: () => void; T: ThemeTokens }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, ${T.bg} 0%, #FFF 55%, ${T.primarySoft} 100%)` }}>
      <div style={{ position: 'absolute', top: 80, left: -60, width: 220, height: 220, borderRadius: 220, background: `radial-gradient(circle, ${T.primary}30 0%, transparent 70%)`, filter: 'blur(8px)' }}/>
      <div style={{ position: 'absolute', bottom: 200, right: -80, width: 260, height: 260, borderRadius: 260, background: `radial-gradient(circle, ${T.primary}25 0%, transparent 70%)`, filter: 'blur(10px)' }}/>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', padding: '90px 28px 40px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `radial-gradient(circle at 30% 30%, #5A7EFF 0%, ${T.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 14px ${T.primary}40` }}>
            <Icon.Sparkle s={16} c="#fff"/>
          </div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 22, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>kidai</div>
        </div>
        {/* Hero */}
        <div style={{ marginBottom: 38 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFF', padding: '6px 12px', borderRadius: 999, border: `1px solid ${SHARED.line}`, marginBottom: 18, fontFamily: SHARED.sans, fontSize: 11, fontWeight: 600, color: T.ink2, letterSpacing: 0.4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: '#4AAE8C' }}/>
            Trusted by 24,000 parents
          </div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 40, lineHeight: 1.05, color: T.ink, letterSpacing: -1.2, fontWeight: 500, marginBottom: 16 }}>
            Parenting is<br/>hard.<br/>
            <span style={{ fontStyle: 'italic', color: T.primary }}>You don't have</span><br/>
            <span style={{ fontStyle: 'italic', color: T.primary }}>to do it alone.</span>
          </div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 16, lineHeight: 1.5, color: T.ink2, maxWidth: 320 }}>
            Whisper what just happened. Get warm, science-backed guidance in 12 seconds.
          </div>
        </div>
        <button onClick={onStart} style={{ width: '100%', padding: '17px 20px', borderRadius: 16, border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 14px 28px ${T.ink}30` }}>
          Try your first moment — free
          <Icon.ArrowRight s={17} c="#fff"/>
        </button>
        <div style={{ textAlign: 'center', marginTop: 14, fontFamily: SHARED.sans, fontSize: 12, color: T.ink3 }}>
          Already a member? <span style={{ color: T.ink, fontWeight: 600 }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

function MicArt({ T }: { T: ThemeTokens }) {
  return (
    <div style={{ position: 'relative', width: 200, height: 200 }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: 200, border: `1.5px solid ${T.primary}`, animation: `pg-ring 2.4s ease-out ${i * 0.55}s infinite`, opacity: 0.5 }}/>
      ))}
      <div style={{ position: 'absolute', inset: 50, borderRadius: 200, background: `radial-gradient(circle at 35% 30%, #5A7EFF 0%, ${T.primary} 70%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 18px 40px ${T.primary}55` }}>
        <Icon.Mic s={42} c="#fff"/>
      </div>
    </div>
  );
}

function LensArt({ T }: { T: ThemeTokens }) {
  const cards = ['#FFF', T.primarySoft, T.bg];
  return (
    <div style={{ position: 'relative', width: 220, height: 200 }}>
      {cards.map((bg, i) => (
        <div key={i} style={{ position: 'absolute', left: i * 14, top: i * 10, width: 180, height: 130, borderRadius: 20, background: bg, border: `1px solid ${SHARED.line}`, boxShadow: '0 6px 20px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
          <div style={{ width: '80%', height: 8, borderRadius: 4, background: i === 0 ? T.primary : T.primarySoft }}/>
          <div style={{ width: '60%', height: 6, borderRadius: 4, background: SHARED.line }}/>
          <div style={{ width: '90%', height: 6, borderRadius: 4, background: SHARED.line }}/>
        </div>
      ))}
    </div>
  );
}

function PatternArt({ T }: { T: ThemeTokens }) {
  const pts = [0.3, 0.6, 0.4, 0.9, 0.5, 0.8, 0.6, 0.95, 0.7];
  return (
    <div style={{ width: 220, height: 160, position: 'relative' }}>
      <svg width="220" height="160" viewBox="0 0 220 160">
        {pts.map((h, i) => (
          <rect key={i} x={i * 26 + 4} y={160 - h * 120} width={18} height={h * 120} rx={6} fill={i >= 5 ? T.primary : T.primarySoft}/>
        ))}
      </svg>
    </div>
  );
}

export function OnboardingScreen({ onDone, T }: { onDone: () => void; T: ThemeTokens }) {
  const [i, setI] = useState(0);
  const slides = [
    { eyebrow: '01 — Speak it out', title: "Just talk. Like a friend's on the line.", body: "No journaling. No forms. Hold the mic, breathe out the chaos. Kidai listens with no judgment.", art: 'mic' },
    { eyebrow: '02 — Get a clear lens', title: 'See the moment from a calmer place.', body: "You'll get back a structured read — what happened, why, and what to try. Rooted in child development research.", art: 'lens' },
    { eyebrow: '03 — Notice the patterns', title: 'Patterns become visible. So you change them.', body: 'Over time, Kidai surfaces the triggers, times, and contexts that keep tripping you up. Quietly, kindly.', art: 'pattern' },
  ];
  const s = slides[i];
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: T.bg }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <button onClick={onDone} style={{ position: 'absolute', top: 58, right: 22, zIndex: 20, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 13, color: T.ink3, fontWeight: 500 }}>Skip</button>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '90px 28px 40px' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          {s.art === 'mic' && <MicArt T={T}/>}
          {s.art === 'lens' && <LensArt T={T}/>}
          {s.art === 'pattern' && <PatternArt T={T}/>}
        </div>
        <div style={{ minHeight: 220 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 700, color: T.primary, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>{s.eyebrow}</div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 28, lineHeight: 1.15, color: T.ink, letterSpacing: -0.6, fontWeight: 500, marginBottom: 14 }}>{s.title}</div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 15, lineHeight: 1.55, color: T.ink2 }}>{s.body}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30 }}>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {slides.map((_, j) => (
              <div key={j} style={{ height: 4, flex: j === i ? 3 : 1, borderRadius: 4, background: j <= i ? T.primary : SHARED.line, transition: 'all .3s' }}/>
            ))}
          </div>
          <button onClick={() => i < 2 ? setI(i + 1) : onDone()} style={{ width: 56, height: 56, borderRadius: 56, border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 22px ${T.ink}30` }}>
            <Icon.ArrowRight s={20} c="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Paywall ─────────────────────────────────────────────────────────────────

export function PaywallScreen({ onStart, onClose, T }: { onStart: () => void; onClose: () => void; T: ThemeTokens }) {
  const [plan, setPlan] = useState<'year' | 'month'>('year');
  const benefits = [
    'Unlimited moments — no daily cap',
    'Per-child personalisation',
    'Pattern detection over time',
    'Co-parent sharing',
    'Privacy-first — never sold',
  ];
  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <button onClick={onClose} style={{ position: 'absolute', top: 54, right: 20, zIndex: 20, width: 32, height: 32, borderRadius: 32, border: 'none', background: SHARED.surfaceAlt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Close s={14} c={T.ink3}/>
      </button>
      <div style={{ height: '100%', overflowY: 'auto', padding: '60px 22px 40px' }}>
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: `radial-gradient(circle at 30% 30%, #5A7EFF 0%, ${T.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 16px 36px ${T.primary}50` }}>
            <Icon.Sparkle s={32} c="#fff"/>
          </div>
        </div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, fontWeight: 500, color: T.ink, letterSpacing: -0.5, textAlign: 'center', marginBottom: 6 }}>The full Kidai, at your fingertips</div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink2, textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>Everything you need to parent with more clarity and less guilt.</div>
        {/* Benefits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 22, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon.Check s={12} c={T.primary}/>
              </div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 14.5, color: T.ink, fontWeight: 500 }}>{b}</div>
            </div>
          ))}
        </div>
        {/* Plan picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[
            { id: 'year', price: '$59', period: '/year', badge: 'SAVE 51%', sub: "That's $4.92/month" },
            { id: 'month', price: '$9.99', period: '/month', badge: null, sub: 'Cancel anytime' },
          ].map(p => (
            <button key={p.id} onClick={() => setPlan(p.id as 'year' | 'month')} style={{
              borderRadius: 16, padding: '14px 16px', border: `2px solid ${plan === p.id ? T.primary : SHARED.line}`,
              background: plan === p.id ? T.primarySoft : SHARED.surface,
              display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'all .15s',
            }}>
              <div style={{ width: 20, height: 20, borderRadius: 20, border: `2px solid ${plan === p.id ? T.primary : SHARED.line}`, background: plan === p.id ? T.primary : 'transparent', marginRight: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {plan === p.id && <div style={{ width: 8, height: 8, borderRadius: 8, background: '#fff' }}/>}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: SHARED.sans, fontSize: 16, fontWeight: 700, color: T.ink }}>
                  {p.price}<span style={{ fontWeight: 400, fontSize: 13, color: T.ink2 }}>{p.period}</span>
                </div>
                <div style={{ fontFamily: SHARED.sans, fontSize: 12, color: T.ink3 }}>{p.sub}</div>
              </div>
              {p.badge && (
                <div style={{ padding: '4px 8px', borderRadius: 8, background: T.primary, fontFamily: SHARED.sans, fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>{p.badge}</div>
              )}
            </button>
          ))}
        </div>
        {/* Testimonial */}
        <div style={{ background: T.primarySoft, borderRadius: 18, padding: 16, marginBottom: 20 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 8 }}>
            "I used to dread 6 PM. Now I understand what's actually happening."
          </div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.ink2 }}>— Parent of a 4-year-old</div>
        </div>
        <button onClick={onStart} style={{ width: '100%', padding: '17px', borderRadius: 16, border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Start 7-day free trial
        </button>
        <div style={{ textAlign: 'center', fontFamily: SHARED.sans, fontSize: 11, color: T.ink3, lineHeight: 1.6 }}>
          Free for 7 days, then {plan === 'year' ? '$59/year' : '$9.99/month'}. Cancel anytime in settings.
        </div>
      </div>
    </div>
  );
}
