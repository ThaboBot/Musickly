// src/ai/flows/inspiration-mode.ts
'use server';
/**
 * @fileOverview A flow that generates a unique song idea each day.
 *
 * - generateSongIdea - A function that generates a song idea with style, theme, and name.
 * - SongIdeaInput - The input type for the generateSongIdea function (currently empty).
 * - SongIdeaOutput - The return type for the generateSongIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SongIdeaInputSchema = z.object({});
export type SongIdeaInput = z.infer<typeof SongIdeaInputSchema>;

const SongIdeaOutputSchema = z.object({
  style: z.string().describe('The musical style of the song.'),
  theme: z.string().describe('The theme or subject matter of the song.'),
  name: z.string().describe('The suggested name for the song.'),
});
export type SongIdeaOutput = z.infer<typeof SongIdeaOutputSchema>;

export async function generateSongIdea(input: SongIdeaInput): Promise<SongIdeaOutput> {
  return generateSongIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'songIdeaPrompt',
  input: {schema: SongIdeaInputSchema},
  output: {schema: SongIdeaOutputSchema},
  prompt: `Generate a unique song idea for today.

It should include:
- The musical style of the song (e.g., pop, rock, jazz, electronic).
- The theme or subject matter of the song (e.g., love, loss, nature, technology).
- A suggested name for the song.

Output the result as a JSON object with the keys "style", "theme", and "name".`,
});

const generateSongIdeaFlow = ai.defineFlow(
  {
    name: 'generateSongIdeaFlow',
    inputSchema: SongIdeaInputSchema,
    outputSchema: SongIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
