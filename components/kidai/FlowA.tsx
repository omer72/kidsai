'use client';

import { useState, useEffect, useRef } from 'react';
import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { Avatar, Card, MicButton, LiveWaveform, PrimaryButton, GhostButton, Chip } from './primitives';
import { ThinkingScreen, ResponseScreen, FollowupScreen } from './screens';
import { KIDS, LOCATIONS, MOODS, INVOLVED, URGENCY, MomentContext, GuidanceResponse } from './data';
import { Kid } from './data';

type Stage = 'idle' | 'recording' | 'recorded' | 'context' | 'thinking' | 'response' | 'followup';

export function FlowA({
  activeKid, setActiveKid, kids: kidsProp, onSubmitDone, T,
}: {
  activeKid: string; setActiveKid: (id: string) => void;
  kids?: typeof KIDS; onSubmitDone: (entry?: any) => void; T: ThemeTokens;
}) {
  const kids = kidsProp ?? KIDS;
  const [stage, setStage] = useState<Stage>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [ctx, setCtx] = useState<MomentContext>({ location: null, mood: null, involved: null, urgency: null });
  const [step, setStep] = useState(0);
  const [response, setResponse] = useState<GuidanceResponse | undefined>();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const kid = kids.find(k => k.id === activeKid) ?? kids[0]!;

  useEffect(() => {
    if (stage === 'recording') {
      const start = Date.now();
      timerRef.current = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage]);

  useEffect(() => {
    if (stage === 'thinking') {
      fetchGuidance();
    }
  }, [stage]);

  const fetchGuidance = async () => {
    try {
      const kid = kids.find(k => k.id === activeKid);
      const res = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kidName: kid?.name ?? 'your child',
          kidAge: kid?.age ?? 4,
          context: ctx,
          transcript: transcript ?? undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch {
      // fall through to demo response
    }
    setStage('response');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRef.current = mr;
    } catch {
      // microphone denied — still allow flow
    }
    setElapsed(0);
    setStage('recording');
  };

  const stopRecording = () => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stop();
    }
    if (elapsed > 0.4) {
      setStage('recorded');
      // Transcription fires in background; result available before user reaches 'thinking'
      mediaRef.current!.addEventListener('stop', async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const form = new FormData();
          form.append('audio', blob, 'recording.webm');
          const res = await fetch('/api/transcribe', { method: 'POST', body: form });
          if (res.ok) {
            const { text } = await res.json();
            setTranscript(text ?? null);
          }
        } catch {}
      }, { once: true });
    } else {
      setStage('idle');
    }
  };

  const reset = () => {
    setStage('idle'); setElapsed(0); setStep(0); setResponse(undefined);
    setTranscript(null); setAudioBlob(null);
    setCtx({ location: null, mood: null, involved: null, urgency: null });
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  // ── IDLE / RECORDING ──────────────────────────────────────────────────────
  if (stage === 'idle' || stage === 'recording') {
    return (
      <div style={{ padding: '14px 22px 120px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 13, color: T.ink3, fontWeight: 500 }}>{greeting}</div>
            <div style={{ fontFamily: SHARED.serif, fontSize: 22, fontWeight: 500, color: T.ink, marginTop: 2, letterSpacing: -0.2 }}>What happened?</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {kids.map(k => (
              <button key={k.id} onClick={() => setActiveKid(k.id)} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}>
                <Avatar kid={k} size={36} ring={k.id === activeKid}/>
              </button>
            ))}
          </div>
        </div>
        <Card style={{ marginBottom: 'auto', background: stage === 'recording' ? T.primarySoft : undefined, borderColor: stage === 'recording' ? 'transparent' : undefined, transition: 'all .3s' }}>
          <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.primaryInk, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>
            {stage === 'recording' ? 'Listening' : 'Hold to speak'}
          </div>
          <div style={{ fontFamily: SHARED.serif, fontSize: 19, lineHeight: 1.4, color: T.ink, letterSpacing: -0.1 }}>
            {stage === 'recording'
              ? "Tell the whole story. Don't edit. I'll listen the way a friend would."
              : "Describe what just happened. Include what you did and how it ended."}
          </div>
          <div style={{ marginTop: 14, height: 56 }}>
            <LiveWaveform active={stage === 'recording'} bars={32} color={T.primary}/>
          </div>
          {stage === 'recording' && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: SHARED.danger, animation: 'pg-pulse 1s infinite' }}/>
              <div style={{ fontFamily: SHARED.mono, fontSize: 13, color: T.ink2, fontWeight: 500 }}>{fmt(elapsed)}</div>
            </div>
          )}
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}>
          <MicButton recording={stage === 'recording'} onStart={startRecording} onStop={stopRecording} size={156} T={T}/>
          <div style={{ marginTop: 16, fontFamily: SHARED.sans, fontSize: 13, color: T.ink3, fontWeight: 500 }}>
            {stage === 'recording' ? 'Release when done' : 'Press and hold'}
          </div>
        </div>
      </div>
    );
  }

  // ── RECORDED ──────────────────────────────────────────────────────────────
  if (stage === 'recorded') {
    return (
      <div style={{ padding: '14px 22px 120px' }}>
        <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>Recorded</div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, lineHeight: 1.2, color: T.ink, letterSpacing: -0.3, marginBottom: 18 }}>
          Good. A few quick questions.
        </div>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 44, background: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon.Play s={16} c="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <LiveWaveform active={false} height={36} bars={40} color={T.primary}/>
            </div>
            <div style={{ fontFamily: SHARED.mono, fontSize: 13, color: T.ink2, fontWeight: 500 }}>{fmt(elapsed)}</div>
          </div>
          <div style={{ fontFamily: SHARED.sans, fontSize: 13, color: T.ink3, lineHeight: 1.5, fontStyle: 'italic', paddingTop: 10, borderTop: `1px solid ${SHARED.line}` }}>
            "…she just dropped to the ground in the park parking lot and started screaming…"
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostButton onClick={reset} style={{ flex: 1, justifyContent: 'center' }}>Re-record</GhostButton>
          <PrimaryButton onClick={() => setStage('context')} T={T} style={{ flex: 2 }}>
            Continue <Icon.ArrowRight s={16} c="#fff"/>
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // ── CONTEXT ───────────────────────────────────────────────────────────────
  if (stage === 'context') {
    const steps = [
      {
        key: 'location' as keyof MomentContext,
        q: 'Where did it happen?',
        options: LOCATIONS,
        render: (o: typeof LOCATIONS[0], active: boolean, set: () => void) => (
          <Chip key={o.id} active={active} onClick={set} T={T} style={{ padding: '14px 18px', fontSize: 15 }}>
            {o.label} <span style={{ color: active ? 'rgba(255,255,255,0.7)' : T.ink3, fontSize: 12, marginLeft: 4 }}>{o.hint}</span>
          </Chip>
        ),
      },
      {
        key: 'mood' as keyof MomentContext,
        q: 'How were they feeling?',
        options: MOODS,
        render: (o: typeof MOODS[0], active: boolean, set: () => void) => (
          <Chip key={o.id} active={active} onClick={set} T={T} style={{ padding: '14px 18px', fontSize: 15 }}>
            <span style={{ fontSize: 16, marginRight: 2 }}>{o.glyph}</span>{o.label}
          </Chip>
        ),
      },
      {
        key: 'involved' as keyof MomentContext,
        q: 'Who else was there?',
        options: INVOLVED,
        render: (o: typeof INVOLVED[0], active: boolean, set: () => void) => (
          <Chip key={o.id} active={active} onClick={set} T={T} style={{ padding: '14px 18px', fontSize: 15 }}>{o.label}</Chip>
        ),
      },
      {
        key: 'urgency' as keyof MomentContext,
        q: 'How urgent is this?',
        options: URGENCY,
        render: (o: typeof URGENCY[0], active: boolean, set: () => void) => (
          <Chip key={o.id} active={active} onClick={set} dot={o.dot} T={T} style={{ padding: '14px 18px', fontSize: 15 }}>
            {o.label} <span style={{ color: active ? 'rgba(255,255,255,0.7)' : T.ink3, fontSize: 12, marginLeft: 4 }}>{o.desc}</span>
          </Chip>
        ),
      },
    ];
    const s = steps[step];
    const val = ctx[s.key];
    const canNext = !!val;
    return (
      <div style={{ padding: '14px 22px 120px', position: 'relative', minHeight: '100%' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 22 }}>
          {steps.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= step ? T.primary : SHARED.line, transition: 'all .3s' }}/>
          ))}
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.ink3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
          Step {step + 1} of {steps.length}
        </div>
        <div style={{ fontFamily: SHARED.serif, fontSize: 26, lineHeight: 1.2, color: T.ink, letterSpacing: -0.3, marginBottom: 22 }}>
          {s.q}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(s.options as any[]).map((o: any) => s.render(o, val === o.id, () => setCtx({ ...ctx, [s.key]: o.id })))}
        </div>
        <div style={{ position: 'absolute', bottom: 100, left: 22, right: 22, display: 'flex', gap: 10 }}>
          {step > 0 && (
            <GhostButton onClick={() => setStep(step - 1)} style={{ justifyContent: 'center' }}>
              <Icon.Back s={16}/>
            </GhostButton>
          )}
          <PrimaryButton
            disabled={!canNext}
            onClick={() => { if (step < steps.length - 1) setStep(step + 1); else setStage('thinking'); }}
            T={T} style={{ flex: 1 }}
          >
            {step < steps.length - 1 ? 'Next' : 'Get guidance'} <Icon.ArrowRight s={16} c={canNext ? '#fff' : T.ink3}/>
          </PrimaryButton>
        </div>
      </div>
    );
  }

  if (stage === 'thinking') return <ThinkingScreen activeKid={activeKid} T={T}/>;
  if (stage === 'response') return <ResponseScreen ctx={ctx} onFollowup={() => setStage('followup')} onDone={() => { onSubmitDone({ title: response?.title ?? 'Moment logged', mood: ctx.mood ?? 'upset', where: ctx.location ?? 'inside' }); reset(); }} response={response} T={T}/>;
  if (stage === 'followup') return <FollowupScreen onDone={() => { onSubmitDone({ title: response?.title ?? 'Moment logged', mood: ctx.mood ?? 'upset', where: ctx.location ?? 'inside' }); reset(); }} T={T}/>;
  return null;
}
