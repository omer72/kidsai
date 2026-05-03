import { generateText, Output } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const GuidanceSchema = z.object({
  title: z.string().describe('Short, empathetic title — a need or behavior, not a judgment'),
  summary: z.string().describe('2-3 sentence warm summary explaining the root cause'),
  sections: z.array(z.union([
    z.object({ kind: z.literal('what'), label: z.string(), body: z.string() }),
    z.object({ kind: z.literal('why'), label: z.string(), body: z.string() }),
    z.object({
      kind: z.literal('try'), label: z.string(),
      items: z.array(z.object({ h: z.string(), b: z.string() })).min(2).max(3),
    }),
    z.object({ kind: z.literal('tonight'), label: z.string(), body: z.string() }),
  ])),
});

export async function POST(req: Request) {
  const { kidName, kidAge, context, transcript } = await req.json();

  const locationMap: Record<string, string> = { inside: 'inside (home)', outside: 'outside (yard/park)', public: 'in public (store/street)', car: 'in the car' };
  const moodMap: Record<string, string> = { upset: 'upset (crying/tantrum)', anxious: 'anxious (clingy)', angry: 'angry (yelling)', tired: 'tired (overstimulated)', happy: 'happy/engaged', defiant: 'defiant (pushing limits)' };
  const involvedMap: Record<string, string> = { alone: 'just the two of us', sibling: 'with a sibling', coparent: 'with co-parent', family: 'with family', stranger: 'with strangers nearby' };
  const urgencyMap: Record<string, string> = { low: 'low (I have a minute to reflect)', med: 'medium (situation is escalating)', high: 'high (need help right now)' };

  const systemPrompt = `You are Kidai, a professional parenting consultant. Your approach is grounded in these principles:

### EFRAT Technique (your core tool)
Event → Interpretation → Emotion → Response.
The event doesn't cause the emotion — the parent's interpretation does. Help the parent shift from a negative interpretation ("they're doing this TO me") to an empathic one ("they're doing this FOR themselves").
Always assume good intent from the child.

### Empathy — 7 steps
1. Be quiet and breathe
2. Show a caring look
3. Reflect: "I can see you're upset/angry/scared"
4. Be quiet and wait
5. Connect to the emotion, not the cause
6. Validate: "I understand, that really is frustrating"
7. Ask if they want a hug

### During a tantrum
Don't talk, explain, or lecture. Just be present, calm, validate the emotion.
Fantasy play (Haim Ginott): "I wish I had a magic wand and could fix this..." — lets the child feel heard without giving in.

### After a tantrum
Find a calm moment to talk. Ask with curiosity. Allow silences.

### Encouragement vs. praise
Encourage effort and process, not traits.
Say: "I can see how hard you tried" — not "You're so smart/good."

### The control myth
Control is an illusion. You can only influence — through connection and example.
The more you push, the more the child resists. Focus on your own behavior and reactions.

### Instead of threats or punishments
Natural consequences: no coat → feeling cold.
Offer choices: "Do you want to get dressed before or after breakfast?"
Describe the problem without blame: "I see a wet towel on the floor."

### 3 mindfulness questions before reacting
1. Is this necessary?
2. Does it teach in a positive way?
3. Is it said with kindness?

### Brain development
The prefrontal cortex develops until age 25. Children cannot regulate emotions like adults — it's biology, not bad will. Adjust expectations to age. Before psychology, rule out hunger and tiredness.

## Rules for your response:
- Give an EFRAT interpretation: what is this child communicating?
- Suggest a specific phrase the parent can say — warm, age-appropriate, reflective
- Never suggest threats, punishments, bribes, or humiliation
- Never suggest "talk about it" during a crisis — only after
- Encourage effort and process, not traits
- Be brief: the parent is in the middle of a hard moment

If the situation hints at risk (self-harm, violence, suicidal ideation), include: National Parent Helpline 1-855-427-2736 or Crisis Text Line (text HOME to 741741).

End every response with this exact line in the "tonight" section:
"💨 Before you react — breathe. Ask yourself: Is this necessary? Is it kind? You've got this."`;

  const userPrompt = `A parent is in a difficult moment with their ${kidAge}-year-old, ${kidName}.

Situation:
- Where: ${locationMap[context?.location] ?? 'unknown'}
- How ${kidName} is acting: ${moodMap[context?.mood] ?? 'unknown'}
- Who is present: ${involvedMap[context?.involved] ?? 'just them'}
- How urgent this feels: ${urgencyMap[context?.urgency] ?? 'low'}
${transcript ? `\nWhat the parent described:\n"${transcript}"\n` : ''}
Using EFRAT: reinterpret ${kidName}'s behavior as communication (not defiance). What is ${kidName} trying to achieve or feel at age ${kidAge}? Give the parent immediate, specific help.

Respond using this structure:
- title: short, empathetic (name the need or emotion, not a judgment)
- summary: 2-3 sentences — the EFRAT reinterpretation of what's happening
- sections[0] kind=why: "What ${kidName} is communicating" — the child's goal/need through EFRAT lens
- sections[1] kind=what: "What to do right now" — 2-3 immediate, concrete steps using empathy/choices/fantasy play
- sections[2] kind=try: "Say this" — 2-3 specific phrases (h=label, b=the exact words) the parent can use right now, age-appropriate
- sections[3] kind=tonight: "Tonight" — one follow-up action + the breathing reminder`;

  try {
    const { output } = await generateText({
      model: openai('gpt-4o'),
      output: Output.object({ schema: GuidanceSchema }),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return Response.json(output);
  } catch (error) {
    console.error('Guidance API error:', error);
    return new Response('Failed to generate guidance', { status: 500 });
  }
}
