import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { conversations }: { conversations: string[] } = await req.json();

  if (!conversations.length) {
    return Response.json({ insight: null });
  }

  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: `You are a child behavior pattern analyst grounded in Adlerian psychology.
Given several parenting moment descriptions, identify a recurring pattern in the child's behavior and what goal the child is likely pursuing (attention, power, revenge, or avoidance of failure).
Write 3-4 sentences in warm, plain English. Be specific and actionable — not generic reassurance.
Name the pattern directly, explain what need drives it, and give one concrete shift the parent can try.`,
    prompt: `Here are ${conversations.length} recent moments this parent described:\n\n${conversations.join('\n---\n')}\n\nWhat pattern do you see? What is the child trying to accomplish, and what should the parent try differently?`,
  });

  return Response.json({ insight: text });
}
