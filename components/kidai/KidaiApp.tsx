'use client';

import { useState } from 'react';
import { THEME_MAP, SHARED, Theme, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { IOSFrame, IOSStatusBar, TabBar } from './primitives';
import { FlowA } from './FlowA';
import { FlowB } from './FlowB';
import { HistoryScreen, KidsScreen } from './screens';
import { WelcomeScreen, OnboardingScreen, PaywallScreen } from './MarketingScreens';
import { TrialReminderBanner, TrialEndingScreen, LapsedScreen, SubscriptionScreen } from './TrialScreens';
import { useKids, useHistory, useActiveKid } from './useStore';

type Stage =
  | 'welcome' | 'onboarding' | 'paywall' | 'app'
  | 'trial-day5' | 'trial-end' | 'lapsed' | 'subscription';

type Tab = 'home' | 'history' | 'kids';
type Flow = 'A' | 'B';

// ─── App inside the device ───────────────────────────────────────────────────

function AppWrapper({ flow, T, trialBanner }: { flow: Flow; T: ThemeTokens; trialBanner?: boolean }) {
  const [tab, setTab] = useState<Tab>('home');
  const [showBanner, setShowBanner] = useState(!!trialBanner);
  const { activeKid, setActiveKid } = useActiveKid();
  const { kids, addKid, removeKid } = useKids();
  const { history, addEntry } = useHistory();

  const FlowComponent = flow === 'A' ? FlowA : FlowB;

  const handleSubmitDone = (entry?: { title: string; mood: string; where: string }) => {
    if (entry) {
      const now = new Date();
      const when = `Today · ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() < 12 ? 'AM' : 'PM'}`;
      addEntry({
        kid: activeKid,
        when,
        where: entry.where ?? 'Unknown',
        mood: entry.mood ?? 'upset',
        title: entry.title,
        pattern: false,
      });
    }
    setTab('history');
  };

  let content;
  if (tab === 'home') {
    content = (
      <div>
        {showBanner && (
          <div style={{ padding: '0 20px' }}>
            <TrialReminderBanner daysLeft={2} T={T} onUpgrade={() => {}} onDismiss={() => setShowBanner(false)}/>
          </div>
        )}
        <FlowComponent
          key={flow}
          activeKid={activeKid}
          setActiveKid={setActiveKid}
          kids={kids}
          onSubmitDone={handleSubmitDone}
          T={T}
        />
      </div>
    );
  } else if (tab === 'history') {
    content = <HistoryScreen activeKid={activeKid} history={history} T={T}/>;
  } else {
    content = <KidsScreen activeKid={activeKid} setActiveKid={setActiveKid} kids={kids} addKid={addKid} removeKid={removeKid} T={T}/>;
  }

  return (
    <div style={{ width: '100%', height: '100%', background: T.bg, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: SHARED.sans, color: T.ink }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar/>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '58px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `radial-gradient(circle at 30% 30%, #5A7EFF 0%, ${T.primary} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 10px ${T.primary}40` }}>
            <Icon.Sparkle s={14} c="#fff"/>
          </div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 19, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>kidai</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>{content}</div>
      <TabBar current={tab} onChange={(t) => setTab(t as Tab)} T={T}/>
    </div>
  );
}

// ─── Stage Router ─────────────────────────────────────────────────────────────

export function KidaiApp() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [flow] = useState<Flow>('A');
  const [theme] = useState<Theme>('warm');
  const T = THEME_MAP[theme];

  const go = (s: Stage) => setStage(s);

  const content = (() => {
    switch (stage) {
      case 'welcome':    return <WelcomeScreen T={T} onStart={() => go('onboarding')}/>;
      case 'onboarding': return <OnboardingScreen T={T} onDone={() => go('paywall')}/>;
      case 'paywall':    return <PaywallScreen T={T} onStart={() => go('app')} onClose={() => go('app')}/>;
      case 'trial-day5': return <AppWrapper flow={flow} T={T} trialBanner/>;
      case 'trial-end':  return <TrialEndingScreen T={T} onContinue={() => go('app')} onCancel={() => go('lapsed')}/>;
      case 'lapsed':     return <LapsedScreen T={T} onResume={() => go('app')}/>;
      case 'subscription': return <SubscriptionScreen T={T} onBack={() => go('app')}/>;
      default:           return <AppWrapper flow={flow} T={T}/>;
    }
  })();

  return (
    <IOSFrame>{content}</IOSFrame>
  );
}
