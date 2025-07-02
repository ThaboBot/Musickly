'use server';
/**
 * @fileOverview A flow that generates album art based on text prompts.
 *
 * - generateAlbumArt - A function that generates album art.
 * - AlbumArtGeneratorInput - The input type for the generateAlbumArt function.
 * - AlbumArtGeneratorOutput - The return type for the generateAlbumArt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlbumArtGeneratorInputSchema = z.object({
  title: z.string().describe('The title of the song or album.'),
  mood: z.string().describe('The mood or feeling of the music (e.g., epic, melancholic, futuristic).'),
  style: z.string().describe('The desired visual style for the art (e.g., photorealistic, abstract, watercolor).'),
});
export type AlbumArtGeneratorInput = z.infer<typeof AlbumArtGeneratorInputSchema>;

const AlbumArtGeneratorOutputSchema = z.object({
  albumArtDataUri: z.string().describe('The generated album art as a data URI.'),
});
export type AlbumArtGeneratorOutput = z.infer<typeof AlbumArtGeneratorOutputSchema>;

export async function generateAlbumArt(input: AlbumArtGeneratorInput): Promise<AlbumArtGeneratorOutput> {
  return albumArtGeneratorFlow(input);
}

const albumArtGeneratorFlow = ai.defineFlow(
  {
    name: 'albumArtGeneratorFlow',
    inputSchema: AlbumArtGeneratorInputSchema,
    outputSchema: AlbumArtGeneratorOutputSchema,
  },
  async ({ title, mood, style }) => {
    const prompt = `Generate a high-quality, square album cover for a song titled "${title}". The mood is "${mood}" and the visual style should be "${style}". The image should be visually compelling and suitable for an album cover. Do not include any text in the image.`;

    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { albumArtDataUri: media.url };
  }
);
