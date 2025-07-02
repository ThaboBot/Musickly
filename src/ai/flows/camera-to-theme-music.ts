'use server';
/**
 * @fileOverview Generates a matching soundtrack based on the colors and objects in a photo.
 *
 * - cameraToThemeMusic - A function that generates a soundtrack for a photo.
 * - CameraToThemeMusicInput - The input type for the cameraToThemeMusic function.
 * - CameraToThemeMusicOutput - The return type for the cameraToThemeMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const CameraToThemeMusicInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CameraToThemeMusicInput = z.infer<
  typeof CameraToThemeMusicInputSchema
>;

const CameraToThemeMusicOutputSchema = z.object({
  soundtrackDescription: z
    .string()
    .describe('A description of the soundtrack generated for the photo.'),
  soundtrackDataUri: z
    .string()
    .describe('The generated soundtrack as a data URI.'),
});
export type CameraToThemeMusicOutput = z.infer<
  typeof CameraToThemeMusicOutputSchema
>;

export async function cameraToThemeMusic(
  input: CameraToThemeMusicInput
): Promise<CameraToThemeMusicOutput> {
  return cameraToThemeMusicFlow(input);
}

const descriptionPrompt = ai.definePrompt({
  name: 'cameraToThemeMusicDescriptionPrompt',
  input: {schema: CameraToThemeMusicInputSchema},
  output: {schema: z.object({soundtrack: z.string()})},
  prompt: `You are a music composer who specializes in creating soundtracks based on images.

You will analyze the image and create a soundtrack description that matches the colors, objects, and lighting in the photo.

Photo: {{media url=photoDataUri}}

Consider the following aspects when creating the soundtrack:
- Overall mood and atmosphere of the image
- Dominant colors and their emotional associations
- Objects and scenes depicted in the image
- Lighting conditions and their impact on the mood
- Cultural context and potential symbolism of the image

Compose a soundtrack description, including the instruments used, the tempo, and the overall style. Be detailed and descriptive.
`,
});

const cameraToThemeMusicFlow = ai.defineFlow(
  {
    name: 'cameraToThemeMusicFlow',
    inputSchema: CameraToThemeMusicInputSchema,
    outputSchema: CameraToThemeMusicOutputSchema,
  },
  async input => {
    // 1. Generate description
    const {output} = await descriptionPrompt(input);
    if (!output?.soundtrack) {
      throw new Error('Failed to generate soundtrack description.');
    }
    const soundtrackDescription = output.soundtrack;

    // 2. Generate audio from description
    const musicPrompt = `Generate a short instrumental track based on the following description: ${soundtrackDescription}`;

    const {media} = await ai.generate({
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

    if (!media) {
      throw new Error('Could not generate musical track.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const soundtrackDataUri =
      'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      soundtrackDescription,
      soundtrackDataUri,
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
