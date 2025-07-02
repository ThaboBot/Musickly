// The AI flow that generates a full music track based on user's voice input.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const VoiceToMusicInputSchema = z.object({
  voiceDataUri: z
    .string()
    .describe(
      "The user's voice input as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});

export type VoiceToMusicInput = z.infer<typeof VoiceToMusicInputSchema>;

const VoiceToMusicOutputSchema = z.object({
  musicDataUri: z
    .string()
    .describe(
      'The AI-generated full musical track as a data URI in WAV format.'
    ),
});

export type VoiceToMusicOutput = z.infer<typeof VoiceToMusicOutputSchema>;

export async function generateMusicFromVoice(input: VoiceToMusicInput): Promise<VoiceToMusicOutput> {
  return voiceToMusicFlow(input);
}

const voiceToMusicPrompt = ai.definePrompt({
  name: 'voiceToMusicPrompt',
  input: {schema: VoiceToMusicInputSchema},
  output: {schema: VoiceToMusicOutputSchema},
  prompt: `You are an AI music composer. You will take the user's voice input (humming or singing) and generate a full musical track based on it.

User Voice Input: {{media url=voiceDataUri}}

Output: A full musical track in WAV format.`,
});

const voiceToMusicFlow = ai.defineFlow(
  {
    name: 'voiceToMusicFlow',
    inputSchema: VoiceToMusicInputSchema,
    outputSchema: VoiceToMusicOutputSchema,
  },
  async input => {
    // First convert the voice input to text
    const {media} = await ai.generate({
      model: ai.defaultModel,
      prompt: `Transcribe the following voice recording into text.

Voice Recording: {{media url=${input.voiceDataUri}}} `,
    });

    if (!media) {
      throw new Error('Could not convert voice data to text.');
    }

    // Then convert the text to a musical track
    const musicPrompt = `Generate a full musical track based on the following vocal melody: ${media}`;

    const {media: generatedMusic} = await ai.generate({
      model: ai.defaultModel,
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: musicPrompt,
    });

    if (!generatedMusic) {
      throw new Error('Could not generate musical track.');
    }

    const audioBuffer = Buffer.from(
      generatedMusic.url.substring(generatedMusic.url.indexOf(',') + 1),
      'base64'
    );

    const musicDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {musicDataUri: musicDataUri};
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
