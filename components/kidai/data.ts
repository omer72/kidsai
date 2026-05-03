export interface Kid {
  id: string;
  name: string;
  age: number;
  color: string;
  initials: string;
}

export interface Location { id: string; label: string; hint: string; }
export interface Mood { id: string; label: string; glyph: string; tone: string; }
export interface Involved { id: string; label: string; }
export interface Urgency { id: string; label: string; desc: string; dot: string; }

export interface ResponseSection {
  kind: 'what' | 'why' | 'try' | 'tonight';
  label: string;
  body?: string;
  items?: { h: string; b: string }[];
}

export interface GuidanceResponse {
  title: string;
  summary: string;
  sections: ResponseSection[];
}

export interface HistoryEntry {
  id: number;
  kid: string;
  when: string;
  where: string;
  mood: string;
  title: string;
  pattern: boolean;
}

export interface Pattern {
  title: string;
  detail: string;
  count: number;
}

export const KIDS: Kid[] = [
  { id: 'maya', name: 'Maya', age: 4, color: '#2E5BFF', initials: 'M' },
  { id: 'leo', name: 'Leo', age: 7, color: '#7C5BE8', initials: 'L' },
];

export const LOCATIONS: Location[] = [
  { id: 'inside', label: 'Inside', hint: 'Home' },
  { id: 'outside', label: 'Outside', hint: 'Yard / park' },
  { id: 'public', label: 'Public', hint: 'Store, street' },
  { id: 'car', label: 'In the car', hint: 'Moving' },
];

export const MOODS: Mood[] = [
  { id: 'upset', label: 'Upset', glyph: '◐', tone: 'Crying, tantrum' },
  { id: 'anxious', label: 'Anxious', glyph: '○', tone: 'Clingy, withdrawn' },
  { id: 'angry', label: 'Angry', glyph: '◉', tone: 'Yelling, hitting' },
  { id: 'tired', label: 'Tired', glyph: '◑', tone: 'Overstimulated' },
  { id: 'happy', label: 'Happy', glyph: '●', tone: 'Engaged, playing' },
  { id: 'defiant', label: 'Defiant', glyph: '◎', tone: 'Pushing limits' },
];

export const INVOLVED: Involved[] = [
  { id: 'alone', label: 'Just us' },
  { id: 'sibling', label: 'Sibling' },
  { id: 'coparent', label: 'Co-parent' },
  { id: 'family', label: 'Family' },
  { id: 'stranger', label: 'Stranger' },
];

export const URGENCY: Urgency[] = [
  { id: 'low', label: 'Low', desc: 'I have a minute', dot: '#4AAE8C' },
  { id: 'med', label: 'Medium', desc: 'Escalating', dot: '#E5A64B' },
  { id: 'high', label: 'High', desc: 'Right now', dot: '#D94A5C' },
];

export const DEMO_RESPONSE: GuidanceResponse = {
  title: 'A need for control, not defiance',
  summary:
    'Four-year-olds often melt down at transitions because they feel powerless — not because they want to disobey. Maya is likely tired, overstimulated, and trying to hold on to a good moment.',
  sections: [
    {
      kind: 'what',
      label: 'What happened',
      body: 'Leaving the park triggered a big protest. She hit the ground and refused to walk. You felt the eyes of other parents and asked her twice, then lifted her.',
    },
    {
      kind: 'why',
      label: 'Why it happened',
      body: 'At 4, the prefrontal cortex is still forming. Fun + ending + hunger + public setting is a four-stack of stressors. Her body went into fight mode before her words could catch up.',
    },
    {
      kind: 'try',
      label: 'What to try next time',
      items: [
        {
          h: 'Signal transitions early',
          b: 'Give two warnings before leaving — a 10-minute and a 2-minute. Let her pick the last thing she does.',
        },
        {
          h: 'Name the feeling first',
          b: '"You were having so much fun. It\'s really hard to stop." Don\'t fix, just name it.',
        },
        {
          h: 'Offer a small choice',
          b: '"Do you want to walk to the car holding my hand, or hopping?" Control returns, meltdown softens.',
        },
      ],
    },
    {
      kind: 'tonight',
      label: 'If you want to reconnect tonight',
      body: 'Before bed, tell her: "Today was hard at the park. I love you even when you\'re having big feelings." No lecture. Just that.',
    },
  ],
};

export const HISTORY: HistoryEntry[] = [
  { id: 1, kid: 'maya', when: 'Yesterday · 6:12 PM', where: 'Outside', mood: 'upset', title: 'Meltdown leaving the park', pattern: true },
  { id: 2, kid: 'maya', when: 'Mon · 7:45 AM', where: 'Inside', mood: 'defiant', title: 'Refused to get dressed', pattern: true },
  { id: 3, kid: 'leo', when: 'Sun · 4:30 PM', where: 'Inside', mood: 'angry', title: 'Fight over screen time', pattern: false },
  { id: 4, kid: 'maya', when: 'Sat · 5:50 PM', where: 'Public', mood: 'upset', title: 'Dinner out — wouldn\'t sit', pattern: true },
  { id: 5, kid: 'leo', when: 'Fri · 8:10 PM', where: 'Inside', mood: 'anxious', title: 'Couldn\'t settle for sleep', pattern: false },
];

export const PATTERNS: Pattern[] = [
  {
    title: 'Transitions around 6 PM',
    detail: '4 of Maya\'s last 7 moments cluster here. Likely hunger + end-of-day fatigue.',
    count: 4,
  },
  {
    title: 'Public settings amplify',
    detail: 'Moments in public escalate 2× faster. Consider prep rituals before outings.',
    count: 3,
  },
];

export interface MomentContext {
  location: string | null;
  mood: string | null;
  involved: string | null;
  urgency: string | null;
}
