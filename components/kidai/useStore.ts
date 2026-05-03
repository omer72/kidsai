'use client';

import { useState, useEffect, useCallback } from 'react';
import { Kid, HistoryEntry, Pattern, KIDS, HISTORY, PATTERNS } from './data';

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── Kids store ──────────────────────────────────────────────────────────────

export function useKids() {
  const [kids, setKidsState] = useState<Kid[]>(() => readLS('kidai:kids', KIDS));

  useEffect(() => {
    const stored = readLS<Kid[]>('kidai:kids', []);
    if (stored.length > 0) setKidsState(stored);
  }, []);

  const setKids = useCallback((next: Kid[]) => {
    setKidsState(next);
    writeLS('kidai:kids', next);
  }, []);

  const addKid = useCallback((kid: Kid) => {
    setKids([...kids, kid]);
  }, [kids, setKids]);

  const removeKid = useCallback((id: string) => {
    setKids(kids.filter(k => k.id !== id));
  }, [kids, setKids]);

  return { kids, setKids, addKid, removeKid };
}

// ─── History store ────────────────────────────────────────────────────────────

export function useHistory() {
  const [history, setHistoryState] = useState<HistoryEntry[]>(() =>
    readLS('kidai:history', HISTORY)
  );

  useEffect(() => {
    const stored = readLS<HistoryEntry[]>('kidai:history', []);
    if (stored.length > 0) setHistoryState(stored);
    else {
      // Seed with demo data on first launch
      writeLS('kidai:history', HISTORY);
    }
  }, []);

  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id'>) => {
    setHistoryState(prev => {
      const next = [{ ...entry, id: Date.now() }, ...prev];
      writeLS('kidai:history', next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistoryState([]);
    writeLS('kidai:history', []);
  }, []);

  return { history, addEntry, clearHistory };
}

// ─── Active kid store ─────────────────────────────────────────────────────────

export function useActiveKid(defaultId = 'maya') {
  const [activeKid, setActiveKidState] = useState<string>(
    () => readLS('kidai:activeKid', defaultId)
  );

  useEffect(() => {
    const stored = readLS<string>('kidai:activeKid', defaultId);
    setActiveKidState(stored);
  }, []);

  const setActiveKid = useCallback((id: string) => {
    setActiveKidState(id);
    writeLS('kidai:activeKid', id);
  }, []);

  return { activeKid, setActiveKid };
}
