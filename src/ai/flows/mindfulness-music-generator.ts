'use server';

/**
 * @fileOverview Generates soundscapes for meditation and mindfulness exercises.
 *
 * - generateMindfulnessMusic - A function that generates mindfulness music.
 * - MindfulnessMusicInput - The input type for the generateMindfulnessMusic function.
 * - MindfulnessMusicOutput - The return type for the generateMindfulnessMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const MindfulnessMusicInputSchema = z.object({
  meditationType: z
    .string()
    .describe('The type of meditation for which to generate music (e.g., sleep, yoga, general mindfulness).'),
  durationMinutes: z
    .number()
    .describe('The duration of the soundscape in minutes.')
    .default(10),
  environmentDescription: z
    .string()
    .describe('The environment the user wants to simulate (e.g. forest, beach, rain).')
    .default('forest'),
});
export type MindfulnessMusicInput = z.infer<typeof MindfulnessMusicInputSchema>;

const MindfulnessMusicOutputSchema = z.object({
  media: z.string().describe('The generated soundscape as a data URI.'),
});
export type MindfulnessMusicOutput = z.infer<typeof MindfulnessMusicOutputSchema>;

export async function generateMindfulnessMusic(
  input: MindfulnessMusicInput
): Promise<MindfulnessMusicOutput> {
  return mindfulnessMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mindfulnessMusicPrompt',
  input: {schema: MindfulnessMusicInputSchema},
  output: {schema: MindfulnessMusicOutputSchema},
  prompt: `Create a soundscape for a meditation of type: {{{meditationType}}}. The duration should be {{{durationMinutes}}} minutes long.
The environment to simulate is: {{{environmentDescription}}}. Output only a single phrase that I will use in a TTS model.`,
});

const mindfulnessMusicFlow = ai.defineFlow(
  {
    name: 'mindfulnessMusicFlow',
    inputSchema: MindfulnessMusicInputSchema,
    outputSchema: MindfulnessMusicOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Algenib'},
          },
        },
      },
      prompt: text!,
    });

    if (!media) {
      throw new Error('no media returned');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
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

