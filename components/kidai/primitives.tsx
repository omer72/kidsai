'use client';

import { useState, useEffect, useMemo, useRef, CSSProperties, ReactNode } from 'react';
import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { Kid } from './data';

// ─── Avatar ────────────────────────────────────────────────────────────────

export function Avatar({ kid, size = 32, ring = false }: { kid: Kid; size?: number; ring?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: kid.color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: SHARED.sans, fontWeight: 600, fontSize: size * 0.4,
      boxShadow: ring ? `0 0 0 3px #fff, 0 0 0 4.5px ${kid.color}` : 'none',
      flexShrink: 0, letterSpacing: 0.2,
    }}>{kid.initials}</div>
  );
}

// ─── Chip ───────────────────────────────────────────────────────────────────

export function Chip({
  active, onClick, children, dot, dense, style = {}, T,
}: {
  active?: boolean; onClick?: () => void; children: ReactNode;
  dot?: string; dense?: boolean; style?: CSSProperties;
  T: ThemeTokens;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: dense ? '6px 11px' : '9px 14px', borderRadius: 999,
      background: active ? T.primary : SHARED.surface,
      color: active ? '#fff' : T.ink,
      border: `1px solid ${active ? T.primary : SHARED.line}`,
      fontFamily: SHARED.sans, fontSize: 14, fontWeight: 500,
      cursor: 'pointer', transition: 'all .15s',
      ...style,
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 7, background: dot, flexShrink: 0 }}/>}
      {children}
    </button>
  );
}

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({ children, style = {}, pad = 16 }: { children: ReactNode; style?: CSSProperties; pad?: number }) {
  return (
    <div style={{
      background: SHARED.surface, borderRadius: 20, padding: pad,
      border: `1px solid ${SHARED.line}`,
      ...style,
    }}>{children}</div>
  );
}

// ─── LiveWaveform ─────────────────────────────────────────────────────────────

export function LiveWaveform({ active, bars = 34, height = 56, color }: {
  active: boolean; bars?: number; height?: number; color: string;
}) {
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setSeed(s => s + 1), 90);
    return () => clearInterval(t);
  }, [active]);
  const heights = useMemo(() => {
    const arr = [];
    for (let i = 0; i < bars; i++) {
      const base = 0.22 + 0.78 * Math.abs(Math.sin((i + seed * 0.6) * 0.55) * Math.cos(i * 0.31 + seed * 0.2));
      arr.push(active ? base : 0.18 + 0.08 * Math.sin(i * 0.8));
    }
    return arr;
  }, [seed, bars, active]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, height, width: '100%' }}>
      {heights.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h * 100}%`, borderRadius: 3,
          background: color, opacity: active ? 0.35 + h * 0.65 : 0.28,
          transition: 'height .12s ease',
        }}/>
      ))}
    </div>
  );
}

// ─── MicButton ───────────────────────────────────────────────────────────────

export function MicButton({ recording, onStart, onStop, size = 164, T }: {
  recording: boolean; onStart: () => void; onStop: () => void; size?: number; T: ThemeTokens;
}) {
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {recording && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: 'absolute', inset: 0, borderRadius: size,
          border: `1.5px solid ${T.primary}`,
          animation: `pg-ring 1.8s ease-out ${i * 0.6}s infinite`,
          pointerEvents: 'none',
        }}/>
      ))}
      <button
        onMouseDown={onStart} onMouseUp={onStop}
        onTouchStart={(e) => { e.preventDefault(); onStart(); }}
        onTouchEnd={(e) => { e.preventDefault(); onStop(); }}
        onMouseLeave={() => { if (recording) onStop(); }}
        style={{
          width: size, height: size, borderRadius: size, border: 'none',
          cursor: 'pointer', padding: 0, position: 'relative',
          background: recording
            ? `radial-gradient(circle at 35% 30%, #5A7EFF 0%, ${T.primary} 60%, ${T.primaryInk} 100%)`
            : `radial-gradient(circle at 35% 30%, #5A7EFF 0%, ${T.primary} 70%)`,
          boxShadow: recording
            ? `0 18px 38px ${T.primary}80, inset 0 2px 4px rgba(255,255,255,0.3)`
            : `0 14px 28px ${T.primary}59, inset 0 2px 4px rgba(255,255,255,0.3)`,
          transition: 'transform .1s ease',
          transform: recording ? 'scale(0.97)' : 'scale(1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon.Mic s={size * 0.36} c="#fff"/>
      </button>
    </div>
  );
}

// ─── Segmented ───────────────────────────────────────────────────────────────

export function Segmented({ options, value, onChange, style = {}, T }: {
  options: { value: string; label: string }[];
  value: string; onChange: (v: string) => void; style?: CSSProperties; T: ThemeTokens;
}) {
  return (
    <div style={{
      display: 'inline-flex', background: SHARED.surfaceAlt, borderRadius: 12,
      padding: 3, gap: 2,
      ...style,
    }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{
          padding: '8px 14px', borderRadius: 10, border: 'none',
          background: value === o.value ? SHARED.surface : 'transparent',
          color: value === o.value ? T.ink : T.ink2,
          fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: value === o.value ? '0 1px 3px rgba(11,29,58,0.08)' : 'none',
          transition: 'all .15s',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// ─── PrimaryButton ───────────────────────────────────────────────────────────

export function PrimaryButton({ children, onClick, disabled, full, style = {}, T }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; full?: boolean; style?: CSSProperties; T: ThemeTokens;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '14px 20px', borderRadius: 14, border: 'none',
      background: disabled ? SHARED.surfaceAlt : T.ink,
      color: disabled ? T.ink3 : '#fff',
      fontFamily: SHARED.sans, fontSize: 15, fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: full ? '100%' : 'auto',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: 'all .15s',
      ...style,
    }}>{children}</button>
  );
}

// ─── GhostButton ─────────────────────────────────────────────────────────────

export function GhostButton({ children, onClick, style = {} }: {
  children: ReactNode; onClick?: () => void; style?: CSSProperties;
}) {
  return (
    <button onClick={onClick} style={{
      padding: '12px 16px', borderRadius: 12, border: `1px solid ${SHARED.line}`,
      background: SHARED.surface, color: '#0B1D3A',
      fontFamily: SHARED.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
}

// ─── TabBar ──────────────────────────────────────────────────────────────────

export function TabBar({ current, onChange, T }: {
  current: string; onChange: (t: string) => void; T: ThemeTokens;
}) {
  const tabs = [
    { id: 'home', Icon: Icon.Home, label: 'Home' },
    { id: 'history', Icon: Icon.Clock, label: 'History' },
    { id: 'kids', Icon: Icon.Kid, label: 'Kids' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 28, paddingTop: 10,
      background: `linear-gradient(to top, ${T.bg} 60%, ${T.bg}00 100%)`,
      display: 'flex', justifyContent: 'center', gap: 6,
    }}>
      <div style={{
        display: 'flex', gap: 2, background: SHARED.surface,
        borderRadius: 999, padding: 5, border: `1px solid ${SHARED.line}`,
        boxShadow: '0 6px 18px rgba(11,29,58,0.08)',
      }}>
        {tabs.map(t => {
          const active = t.id === current;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              border: 'none', background: active ? T.ink : 'transparent',
              color: active ? '#fff' : T.ink2,
              padding: '9px 16px', borderRadius: 999, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
              fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600,
              transition: 'all .15s',
            }}>
              <t.Icon s={16} c={active ? '#fff' : T.ink2}/>
              {active && t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── IOSStatusBar ─────────────────────────────────────────────────────────────

export function IOSStatusBar() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return (
    <div style={{
      height: 44, padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: SHARED.sans, fontSize: 15, fontWeight: 600, color: '#1A1A2E',
    }}>
      <span>{h}:{m}</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#1A1A2E" opacity="0.8">
          <rect x="0" y="4" width="3" height="8" rx="1"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/>
          <rect x="9" y="1" width="3" height="11" rx="1"/>
          <rect x="13.5" y="0" width="2.5" height="12" rx="1" opacity="0.35"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 24 16" fill="none" stroke="#1A1A2E" strokeWidth="1.8" strokeLinecap="round" opacity="0.8">
          <path d="M1 5c6-6 16-6 22 0M5 9c4-4 10-4 14 0M9 13c2-2 6-2 8 0M13 17h-2v-2h2z"/>
        </svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none" opacity="0.8">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke="#1A1A2E" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="18" height="9" rx="2" fill="#1A1A2E"/>
          <path d="M23.5 4.5v4c1.1-.5 1.1-3.5 0-4z" fill="#1A1A2E" fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─── IOSFrame ─────────────────────────────────────────────────────────────────

export function IOSFrame({ children }: { children: ReactNode }) {
  const W = 402, H = 874;
  return (
    <div style={{
      width: '100vw', height: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#E8ECF3',
    }}>
      <div style={{
        width: W, height: H,
        borderRadius: 55,
        boxShadow: '0 60px 120px rgba(0,0,0,0.28), 0 0 0 1px rgba(0,0,0,0.12), inset 0 0 0 2px rgba(255,255,255,0.15)',
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
      }}>
        {/* notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, width: 126, height: 37,
          background: '#1A1A2E', borderRadius: '0 0 22px 22px',
        }}/>
        {children}
      </div>
    </div>
  );
}
