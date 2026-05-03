import OpenAI from 'openai';

export const maxDuration = 30;

const client = new OpenAI();

export async function POST(req: Request) {
  const formData = await req.formData();
  const audioFile = formData.get('audio') as File;

  if (!audioFile) {
    return Response.json({ error: 'No audio file' }, { status: 400 });
  }

  const transcription = await client.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
  });

  return Response.json({ text: transcription.text });
}
