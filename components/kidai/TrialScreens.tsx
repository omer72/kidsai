'use client';

import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { IOSStatusBar } from './primitives';

// ─── Day 5: Reminder banner ───────────────────────────────────────────────────

export function TrialReminderBanner({
  daysLeft, onUpgrade, onDismiss, T,
}: { daysLeft: number; onUpgrade: () => void; onDismiss: () => void; T: ThemeTokens }) {
  return (
    <div style={{ background: '#FFF', borderRadius: 18, padding: 16, border: `1px solid ${SHARED.line}`, marginBottom: 14, position: 'relative' }}>
      <button onClick={onDismiss} style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: 24, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon.Close s={12} c={T.ink3}/>
      </button>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon.Clock s={18} c={T.primary}/>
        </div>
        <div style={{ flex: 1, paddingRight: 18 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 14, fontWeight: 600, color: '#0B1D3A', marginBottom: 4 }}>
            {daysLeft === 1 ? 'Trial ends tomorrow' : `${daysLeft} days left in your trial`}
          </div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 13, lineHeight: 1.45, color: '#415075', marginBottom: 10 }}>
            You've logged 6 moments. Maya's bedtime pattern is starting to come into focus — keep going.
          </div>
          <button onClick={onUpgrade} style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600, color: T.primary, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Continue with Kidai <Icon.ArrowRight s={13} c={T.primary}/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Day 7: Trial ending ──────────────────────────────────────────────────────

export function TrialEndingScreen({ onContinue, onCancel, T }: { onContinue: () => void; onCancel: () => void; T: ThemeTokens }) {
  const stats = [
    { num: '11', label: 'moments logged' },
    { num: '3', label: 'patterns surfaced' },
    { num: '8/11', label: 'felt better after' },
  ];
  const learnings = [
    'Transitions after 6 PM spike for Maya',
    'Naming the feeling halves the duration',
    'Public settings amplify, car rides soothe',
  ];
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: `linear-gradient(180deg, ${T.bg} 0%, #FFF 60%, ${T.primarySoft} 100%)` }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <div style={{ height: '100%', overflowY: 'auto', padding: '70px 22px 28px' }}>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 700, color: T.primary, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Your trial ends today</div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 30, lineHeight: 1.1, color: T.ink, letterSpacing: -0.7, fontWeight: 500, textAlign: 'center', marginBottom: 14, padding: '0 8px' }}>
          Look at what<br/><span style={{ fontStyle: 'italic', color: T.primary }}>you noticed.</span>
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink2, textAlign: 'center', maxWidth: 320, margin: '0 auto 26px', lineHeight: 1.5 }}>
          One week ago, parenting Maya at 6 PM felt like a guess. This week, it stopped being one.
        </div>
        {/* Stats grid */}
        <div style={{ background: '#FFF', borderRadius: 22, padding: '6px 0', border: `1px solid ${SHARED.line}`, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '20px 8px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${SHARED.line}` : 'none' }}>
              <div style={{ fontFamily: SHARED.serif, fontSize: 28, fontWeight: 600, color: T.ink, letterSpacing: -0.5, lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 11, color: T.ink3, marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        {/* Learnings */}
        <div style={{ background: '#FFF', borderRadius: 20, padding: '18px 18px', border: `1px solid ${SHARED.line}`, marginBottom: 22 }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 700, color: T.ink3, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>This week, you learned</div>
          {learnings.map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < learnings.length - 1 ? 12 : 0 }}>
              <div style={{ width: 20, height: 20, borderRadius: 20, background: T.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon.Check s={11} c={T.primary}/>
              </div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink, lineHeight: 1.4 }}>{l}</div>
            </div>
          ))}
        </div>
        {/* CTAs */}
        <button onClick={onContinue} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
          Keep going · $59/year
        </button>
        <button onClick={onContinue} style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${SHARED.line}`, background: SHARED.surface, color: T.ink, cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 14, fontWeight: 500, marginBottom: 10 }}>
          $9.99/month instead
        </button>
        <button onClick={onCancel} style={{ width: '100%', padding: '12px', borderRadius: 12, border: 'none', background: 'transparent', color: T.ink3, cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 13 }}>
          Not right now
        </button>
      </div>
    </div>
  );
}

// ─── Day 8: Lapsed ────────────────────────────────────────────────────────────

export function LapsedScreen({ onResume, T }: { onResume: () => void; T: ThemeTokens }) {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: 0 }}>
        {/* Greyed-out mic */}
        <div style={{ width: 120, height: 120, borderRadius: 120, background: SHARED.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
          <Icon.Mic s={48} c={T.ink3}/>
        </div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, fontWeight: 500, color: T.ink, letterSpacing: -0.5, textAlign: 'center', marginBottom: 12 }}>
          Your trial ended yesterday
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 15, color: T.ink2, textAlign: 'center', lineHeight: 1.55, marginBottom: 32 }}>
          Your history isn't gone — it's waiting. Resume Kidai to pick up right where you left off.
        </div>
        <button onClick={onResume} style={{ width: '100%', padding: '17px', borderRadius: 16, border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
          Resume Kidai · $59/year
        </button>
        <button onClick={onResume} style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1px solid ${SHARED.line}`, background: SHARED.surface, color: T.ink, cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 14, fontWeight: 500 }}>
          Monthly ($9.99) instead
        </button>
      </div>
    </div>
  );
}

// ─── Subscription settings ────────────────────────────────────────────────────

export function SubscriptionScreen({ onBack, T }: { onBack: () => void; T: ThemeTokens }) {
  return (
    <div style={{ width: '100%', height: '100%', background: T.bg }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}><IOSStatusBar/></div>
      <div style={{ padding: '60px 22px 40px', height: '100%', overflowY: 'auto' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: T.ink2, fontFamily: SHARED.sans, fontSize: 14, marginBottom: 18 }}>
          <Icon.Back s={16} c={T.ink2}/> Back
        </button>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, fontWeight: 500, color: T.ink, letterSpacing: -0.5, marginBottom: 20 }}>Subscription</div>
        {/* Member card */}
        <div style={{ background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryInk} 100%)`, borderRadius: 24, padding: '22px 20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Icon.Sparkle s={18} c="#fff"/>
            <div style={{ fontFamily: SHARED.sans, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 }}>KIDAI MEMBER</div>
          </div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 28, fontWeight: 600, color: '#fff', letterSpacing: -0.5, marginBottom: 8 }}>Annual plan</div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Renews May 4, 2027 · $59</div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            {[{ n: '47', l: 'moments' }, { n: '8', l: 'patterns' }, { n: '3', l: 'kids' }].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: SHARED.serif, fontSize: 20, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: SHARED.sans, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Actions */}
        {[
          { label: 'Switch to monthly', sub: '$9.99/month · cancel anytime' },
          { label: 'Pause subscription', sub: 'Up to 3 months' },
          { label: 'Restore purchase', sub: null },
        ].map((a, i) => (
          <div key={i} style={{ background: SHARED.surface, borderRadius: 16, padding: '14px 16px', border: `1px solid ${SHARED.line}`, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontFamily: SHARED.sans, fontSize: 14, fontWeight: 600, color: T.ink }}>{a.label}</div>
              {a.sub && <div style={{ fontFamily: SHARED.sans, fontSize: 12, color: T.ink3 }}>{a.sub}</div>}
            </div>
            <Icon.Chevron s={16} c={T.ink3}/>
          </div>
        ))}
        <button style={{ background: 'transparent', border: 'none', padding: '16px 0 0', cursor: 'pointer', fontFamily: SHARED.sans, fontSize: 13, color: T.ink3, width: '100%', textAlign: 'center' }}>
          Cancel subscription
        </button>
      </div>
    </div>
  );
}
