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

const CameraToThemeMusicInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CameraToThemeMusicInput = z.infer<typeof CameraToThemeMusicInputSchema>;

const CameraToThemeMusicOutputSchema = z.object({
  soundtrack: z.string().describe('A soundtrack generated for the photo.'),
});
export type CameraToThemeMusicOutput = z.infer<typeof CameraToThemeMusicOutputSchema>;

export async function cameraToThemeMusic(input: CameraToThemeMusicInput): Promise<CameraToThemeMusicOutput> {
  return cameraToThemeMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cameraToThemeMusicPrompt',
  input: {schema: CameraToThemeMusicInputSchema},
  output: {schema: CameraToThemeMusicOutputSchema},
  prompt: `You are a music composer who specializes in creating soundtracks based on images.

You will analyze the image and create a soundtrack that matches the colors, objects, and lighting in the photo.

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
    const {output} = await prompt(input);
    return output!;
  }
);
