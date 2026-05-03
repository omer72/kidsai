'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { Avatar, Card, PrimaryButton, GhostButton, Chip } from './primitives';
import {
  DEMO_RESPONSE, HISTORY, PATTERNS, LOCATIONS, MOODS, KIDS,
  MomentContext, GuidanceResponse, HistoryEntry, Kid,
} from './data';

// ─── ThinkingScreen ───────────────────────────────────────────────────────────

export function ThinkingScreen({ activeKid, T }: { activeKid: string; T: ThemeTokens }) {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots(d => (d % 3) + 1), 400);
    return () => clearInterval(t);
  }, []);
  const lines = [
    'Listening to what you shared…',
    'Checking developmental context…',
    'Drafting gentle guidance…',
  ];
  return (
    <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 30 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: 120,
            border: `1.5px solid ${T.primary}`,
            animation: `pg-ring 2.2s ease-out ${i * 0.7}s infinite`,
            opacity: 0.5,
          }}/>
        ))}
        <div style={{
          position: 'absolute', inset: 30, borderRadius: 120,
          background: `radial-gradient(circle at 35% 30%, #5A7EFF 0%, ${T.primary} 70%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 12px 30px ${T.primary}66`,
        }}>
          <Icon.Sparkle s={28} c="#fff"/>
        </div>
      </div>
      <div style={{ fontFamily: SHARED.serif, fontSize: 22, color: T.ink, letterSpacing: -0.2, marginBottom: 22, textAlign: 'center' }}>
        Thinking it through{'.'.repeat(dots)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: dots > i ? 1 : 0.35, transition: 'opacity .4s' }}>
            <div style={{
              width: 18, height: 18, borderRadius: 18, flexShrink: 0,
              background: dots > i ? T.primary : SHARED.line,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {dots > i && <Icon.Check s={11} c="#fff"/>}
            </div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink2 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ResponseScreen ───────────────────────────────────────────────────────────

export function ResponseScreen({
  ctx, onFollowup, onDone, response, T,
}: {
  ctx: MomentContext; onFollowup: () => void; onDone: () => void;
  response?: GuidanceResponse; T: ThemeTokens;
}) {
  const [saved, setSaved] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [whatOpen, setWhatOpen] = useState(false);
  const r = response || DEMO_RESPONSE;
  const trySection = r.sections.find(s => s.kind === 'try');
  const whySection = r.sections.find(s => s.kind === 'why');
  const whatSection = r.sections.find(s => s.kind === 'what');
  const tonightSection = r.sections.find(s => s.kind === 'tonight');

  return (
    <div style={{ padding: '6px 20px 120px' }}>
      {/* Hero card */}
      <div style={{
        background: `linear-gradient(160deg, ${T.primarySoft} 0%, #fff 100%)`,
        borderRadius: 24, padding: '22px 22px 24px', marginBottom: 14,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 22, right: 22,
          width: 36, height: 36, borderRadius: 36,
          background: `radial-gradient(circle at 35% 30%, #5A7EFF 0%, ${T.primary} 70%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 6px 14px ${T.primary}40`,
        }}>
          <Icon.Sparkle s={16} c="#fff"/>
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.primaryInk, marginBottom: 10 }}>
          For {KIDS.find(k => k.id === 'maya')?.name ?? 'your child'}, just now
        </div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, lineHeight: 1.2, color: T.ink, letterSpacing: -0.3, fontWeight: 500, marginBottom: 12, paddingRight: 40 }}>
          {r.title}.
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 15, lineHeight: 1.5, color: T.ink2 }}>
          {r.summary}
        </div>
      </div>

      {/* Try next time */}
      {trySection && (
        <div style={{ background: SHARED.surface, borderRadius: 22, padding: '20px 18px 8px', border: `1px solid ${SHARED.line}`, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 28, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Sparkle s={14} c={T.primary}/>
            </div>
            <div style={{ fontFamily: SHARED.serif, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Try this next time</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 14 }}>
            {trySection.items?.map((it, j) => (
              <div key={j} style={{ background: T.bg, borderRadius: 16, padding: '14px 14px', display: 'flex', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 28, flexShrink: 0,
                  background: SHARED.surface, color: T.primary,
                  border: `1.5px solid ${T.primary}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: SHARED.serif, fontSize: 14, fontWeight: 600,
                }}>{j + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SHARED.sans, fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 4, lineHeight: 1.3 }}>{it.h}</div>
                  <div style={{ fontFamily: SHARED.sans, fontSize: 13.5, lineHeight: 1.5, color: T.ink2 }}>{it.b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tonight */}
      {tonightSection && (
        <div style={{ background: SHARED.surface, borderRadius: 18, padding: '16px 18px', border: `1px solid ${SHARED.line}`, marginBottom: 12 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>🌙 Tonight, before bed</div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14.5, lineHeight: 1.55, color: T.ink }}>{tonightSection.body}</div>
        </div>
      )}

      {/* Why (collapsible) */}
      {whySection && (
        <button onClick={() => setWhyOpen(o => !o)} style={{
          width: '100%', background: SHARED.surface, borderRadius: 18,
          padding: '14px 18px', border: `1px solid ${SHARED.line}`, marginBottom: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, fontWeight: 600, color: T.ink2 }}>Understand why this happened</div>
          <Icon.Chevron s={14} c={T.ink3}/>
        </button>
      )}
      {whyOpen && whySection && (
        <div style={{ background: SHARED.surface, borderRadius: 18, padding: '0 18px 16px', border: `1px solid ${SHARED.line}`, marginBottom: 8, marginTop: -6 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, lineHeight: 1.55, color: T.ink2 }}>{whySection.body}</div>
        </div>
      )}

      {/* What happened (collapsible) */}
      {whatSection && (
        <button onClick={() => setWhatOpen(o => !o)} style={{
          width: '100%', background: SHARED.surface, borderRadius: 18,
          padding: '14px 18px', border: `1px solid ${SHARED.line}`, marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
        }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, fontWeight: 600, color: T.ink2 }}>What I heard</div>
          <Icon.Chevron s={14} c={T.ink3}/>
        </button>
      )}
      {whatOpen && whatSection && (
        <div style={{ background: SHARED.surface, borderRadius: 18, padding: '0 18px 16px', border: `1px solid ${SHARED.line}`, marginBottom: 12, marginTop: -8 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, lineHeight: 1.55, color: T.ink2, fontStyle: 'italic' }}>{whatSection.body}</div>
        </div>
      )}

      {/* Closing line */}
      <div style={{ textAlign: 'center', padding: '4px 0 12px', fontFamily: SHARED.serif, fontSize: 15, color: T.ink3, fontStyle: 'italic' }}>
        "You're doing better than you think. — Kidai"
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setSaved(s => !s)} style={{
          width: 48, height: 48, borderRadius: 12, border: `1px solid ${SHARED.line}`,
          background: saved ? T.primarySoft : SHARED.surface, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon.Star s={20} c={T.primary} filled={saved}/>
        </button>
        <PrimaryButton onClick={onFollowup} style={{ flex: 1 }} T={T}>
          Did it work? <Icon.ArrowRight s={16} c="#fff"/>
        </PrimaryButton>
      </div>
    </div>
  );
}

// ─── FollowupScreen ───────────────────────────────────────────────────────────

export function FollowupScreen({ onDone, T }: { onDone: () => void; T: ThemeTokens }) {
  const [picked, setPicked] = useState<string | null>(null);
  const opts = [
    { id: 'yes', label: '✓  Yes, it helped', color: SHARED.success },
    { id: 'partly', label: '△  Somewhat', color: SHARED.warn },
    { id: 'no', label: '✕  Not this time', color: SHARED.line },
  ];
  return (
    <div style={{ padding: '30px 22px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: SHARED.serif, fontSize: 26, lineHeight: 1.2, color: T.ink, letterSpacing: -0.3 }}>
        Did it work?
      </div>
      <div style={{ fontFamily: SHARED.sans, fontSize: 15, color: T.ink2, lineHeight: 1.5 }}>
        Your answer helps us learn what works for your child.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {opts.map(o => (
          <button key={o.id} onClick={() => setPicked(o.id)} style={{
            padding: '16px 18px', borderRadius: 16, border: `2px solid ${picked === o.id ? T.primary : SHARED.line}`,
            background: picked === o.id ? T.primarySoft : SHARED.surface,
            cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 15, fontWeight: 500,
            color: T.ink, textAlign: 'left', transition: 'all .15s',
          }}>{o.label}</button>
        ))}
      </div>
      <PrimaryButton onClick={onDone} disabled={!picked} T={T} style={{ marginTop: 8 }}>
        Done
      </PrimaryButton>
    </div>
  );
}

// ─── HistoryScreen ────────────────────────────────────────────────────────────

export function HistoryScreen({ activeKid, history = HISTORY, T }: {
  activeKid: string; history?: HistoryEntry[]; T: ThemeTokens;
}) {
  const kidItems = history.filter(h => h.kid === activeKid);
  const kid = KIDS.find(k => k.id === activeKid);
  const mood = (id: string) => MOODS.find(m => m.id === id);
  return (
    <div style={{ padding: '14px 22px 120px' }}>
      <div style={{ fontFamily: SHARED.serif, fontSize: 24, fontWeight: 500, color: T.ink, letterSpacing: -0.3, marginBottom: 6 }}>
        {kid?.name}'s moments
      </div>
      {PATTERNS.filter((_, i) => i === 0).map((p, i) => (
        <div key={i} style={{
          background: `linear-gradient(135deg, ${T.primarySoft} 0%, #fff 100%)`,
          borderRadius: 18, padding: 16, border: `1px solid ${T.primarySoft}`,
          marginBottom: 18, display: 'flex', gap: 12,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon.TrendUp s={16} c={T.primary}/>
          </div>
          <div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 12.5, color: T.ink2, lineHeight: 1.5 }}>{p.detail}</div>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {kidItems.map(item => (
          <div key={item.id} style={{
            background: SHARED.surface, borderRadius: 18, padding: '14px 16px',
            border: `1px solid ${SHARED.line}`, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: T.primarySoft, color: T.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SHARED.serif, fontSize: 18,
            }}>
              {mood(item.mood)?.glyph}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SHARED.sans, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 12, color: T.ink3 }}>{item.when} · {item.where}</div>
            </div>
            {item.pattern && (
              <div style={{
                alignSelf: 'center', padding: '3px 8px', borderRadius: 999,
                background: T.primarySoft, fontFamily: SHARED.sans, fontSize: 10,
                fontWeight: 700, color: T.primaryInk, letterSpacing: 0.4,
                textTransform: 'uppercase', flexShrink: 0,
              }}>Pattern</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── KidsScreen ───────────────────────────────────────────────────────────────

export function KidsScreen({ activeKid, setActiveKid, kids = KIDS, addKid, removeKid, T }: {
  activeKid: string; setActiveKid: (id: string) => void;
  kids?: Kid[]; addKid?: (k: Kid) => void; removeKid?: (id: string) => void;
  T: ThemeTokens;
}) {
  return (
    <div style={{ padding: '14px 22px 120px' }}>
      <div style={{ fontFamily: SHARED.serif, fontSize: 24, fontWeight: 500, color: T.ink, letterSpacing: -0.3, marginBottom: 18 }}>
        Your kids
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {kids.map(k => (
          <button key={k.id} onClick={() => setActiveKid(k.id)} style={{
            background: k.id === activeKid ? T.primarySoft : SHARED.surface,
            borderRadius: 20, padding: '16px 18px',
            border: `2px solid ${k.id === activeKid ? T.primary : SHARED.line}`,
            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
            transition: 'all .15s',
          }}>
            <Avatar kid={k} size={48} ring={k.id === activeKid}/>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: SHARED.sans, fontSize: 16, fontWeight: 700, color: T.ink }}>{k.name}</div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 13, color: T.ink2 }}>{k.age} years old</div>
            </div>
            {k.id === activeKid && (
              <div style={{
                padding: '4px 10px', borderRadius: 999, background: T.primary,
                fontFamily: SHARED.sans, fontSize: 11, fontWeight: 700,
                color: '#fff', letterSpacing: 0.4,
              }}>Active</div>
            )}
          </button>
        ))}
      </div>

      {/* Patterns */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
          Patterns detected
        </div>
        {PATTERNS.map((p, i) => (
          <div key={i} style={{
            background: SHARED.surface, borderRadius: 16, padding: '14px 16px',
            border: `1px solid ${SHARED.line}`, marginBottom: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ flex: 1, fontFamily: SHARED.sans, fontSize: 13.5, fontWeight: 600, color: T.ink }}>{p.title}</div>
              <div style={{
                padding: '2px 8px', borderRadius: 999,
                background: T.primarySoft, fontFamily: SHARED.sans, fontSize: 11,
                fontWeight: 700, color: T.primaryInk,
              }}>{p.count}×</div>
            </div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 12.5, color: T.ink2, lineHeight: 1.5 }}>{p.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
