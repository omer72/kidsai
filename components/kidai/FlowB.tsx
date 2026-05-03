'use client';

import { useState, useEffect, useRef } from 'react';
import { SHARED, ThemeTokens } from './tokens';
import * as Icon from './Icons';
import { Avatar, Card, MicButton, LiveWaveform, PrimaryButton, GhostButton, Chip } from './primitives';
import { ThinkingScreen, ResponseScreen, FollowupScreen } from './screens';
import { KIDS, LOCATIONS, MOODS, INVOLVED, URGENCY, MomentContext, GuidanceResponse } from './data';

type Stage = 'compose' | 'thinking' | 'response' | 'followup';

export function FlowB({
  activeKid, setActiveKid, kids: kidsProp, onSubmitDone, T,
}: {
  activeKid: string; setActiveKid: (id: string) => void;
  kids?: typeof KIDS; onSubmitDone: (entry?: any) => void; T: ThemeTokens;
}) {
  const kids = kidsProp ?? KIDS;
  const [stage, setStage] = useState<Stage>('compose');
  const [recording, setRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ctx, setCtx] = useState<MomentContext>({ location: null, mood: null, involved: null, urgency: null });
  const [response, setResponse] = useState<GuidanceResponse | undefined>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (recording) {
      const start = Date.now();
      timerRef.current = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  useEffect(() => {
    if (stage === 'thinking') fetchGuidance();
  }, [stage]);

  const fetchGuidance = async () => {
    try {
      const kid = KIDS.find(k => k.id === activeKid);
      const res = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kidName: kid?.name, kidAge: kid?.age, context: ctx }),
      });
      if (res.ok) setResponse(await res.json());
    } catch {}
    setStage('response');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => stream.getTracks().forEach(t => t.stop());
      mr.start();
      mediaRef.current = mr;
    } catch {}
    setElapsed(0);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRef.current?.state === 'recording') mediaRef.current.stop();
    setRecording(false);
    if (elapsed > 0.4) setHasRecording(true);
  };

  const reset = () => {
    setStage('compose'); setRecording(false); setHasRecording(false);
    setElapsed(0); setResponse(undefined);
    setCtx({ location: null, mood: null, involved: null, urgency: null });
  };

  const canSubmit = hasRecording && ctx.location && ctx.mood && ctx.urgency;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  if (stage === 'thinking') return <ThinkingScreen activeKid={activeKid} T={T}/>;
  if (stage === 'response') return <ResponseScreen ctx={ctx} onFollowup={() => setStage('followup')} onDone={() => { onSubmitDone({ title: response?.title ?? 'Moment logged', mood: ctx.mood ?? 'upset', where: ctx.location ?? 'inside' }); reset(); }} response={response} T={T}/>;
  if (stage === 'followup') return <FollowupScreen onDone={() => { onSubmitDone({ title: response?.title ?? 'Moment logged', mood: ctx.mood ?? 'upset', where: ctx.location ?? 'inside' }); reset(); }} T={T}/>;

  return (
    <div style={{ padding: '12px 16px 120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, padding: '0 6px' }}>
        <div style={{ fontFamily: SHARED.serif, fontSize: 22, fontWeight: 500, color: T.ink, letterSpacing: -0.2 }}>New moment</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {kids.map(k => (
            <button key={k.id} onClick={() => setActiveKid(k.id)} style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}>
              <Avatar kid={k} size={32} ring={k.id === activeKid}/>
            </button>
          ))}
        </div>
      </div>

      {/* Mic block */}
      <Card pad={18} style={{ marginBottom: 12, background: recording ? T.primarySoft : undefined, borderColor: recording ? 'transparent' : undefined, transition: 'all .25s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <MicButton recording={recording} onStart={startRecording} onStop={stopRecording} size={76} T={T}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SHARED.sans, fontSize: 12, fontWeight: 600, color: T.primaryInk, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>
              {recording ? 'Listening' : hasRecording ? 'Recorded' : 'Hold to speak'}
            </div>
            <div style={{ fontFamily: SHARED.sans, fontSize: 14, color: T.ink2, lineHeight: 1.4 }}>
              {recording ? "Tell the whole story." : hasRecording ? `${fmt(elapsed)} · tap to play` : "Press and hold the mic"}
            </div>
            <div style={{ marginTop: 8, height: 26 }}>
              <LiveWaveform active={recording} bars={28} height={26} color={T.primary}/>
            </div>
          </div>
        </div>
      </Card>

      {/* Context grid */}
      <Card pad={16} style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 600, color: T.ink2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Where</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {LOCATIONS.map(o => (
            <Chip key={o.id} dense active={ctx.location === o.id} onClick={() => setCtx({ ...ctx, location: o.id })} T={T}>{o.label}</Chip>
          ))}
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 600, color: T.ink2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Mood</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
          {MOODS.map(o => {
            const active = ctx.mood === o.id;
            return (
              <button key={o.id} onClick={() => setCtx({ ...ctx, mood: o.id })} style={{
                padding: '11px 8px', borderRadius: 12, cursor: 'pointer',
                background: active ? T.primary : SHARED.surfaceAlt,
                color: active ? '#fff' : T.ink,
                border: 'none',
                fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                transition: 'all .15s',
              }}>
                <span style={{ fontSize: 16 }}>{o.glyph}</span>
                {o.label}
              </button>
            );
          })}
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 600, color: T.ink2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Who</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {INVOLVED.map(o => (
            <Chip key={o.id} dense active={ctx.involved === o.id} onClick={() => setCtx({ ...ctx, involved: o.id })} T={T}>{o.label}</Chip>
          ))}
        </div>
        <div style={{ fontFamily: SHARED.sans, fontSize: 11, fontWeight: 600, color: T.ink2, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 }}>Urgency</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {URGENCY.map(o => {
            const active = ctx.urgency === o.id;
            return (
              <button key={o.id} onClick={() => setCtx({ ...ctx, urgency: o.id })} style={{
                flex: 1, padding: '11px 8px', borderRadius: 12, cursor: 'pointer',
                background: active ? T.ink : SHARED.surfaceAlt,
                color: active ? '#fff' : T.ink,
                border: 'none', textAlign: 'left',
                fontFamily: SHARED.sans, fontSize: 13, fontWeight: 600,
                display: 'flex', flexDirection: 'column', gap: 2,
                transition: 'all .15s',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 6, background: o.dot }}/>
                  {o.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 500, color: active ? 'rgba(255,255,255,0.7)' : T.ink3 }}>{o.desc}</span>
              </button>
            );
          })}
        </div>
      </Card>

      <PrimaryButton full disabled={!canSubmit} onClick={() => setStage('thinking')} T={T}>
        <Icon.Sparkle s={14} c={canSubmit ? '#fff' : T.ink3}/>
        Get guidance
      </PrimaryButton>
    </div>
  );
}
