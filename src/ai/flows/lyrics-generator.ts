'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating lyrics for a song.
 *
 * - generateLyrics - A function that takes song details as input and returns generated lyrics.
 * - LyricsGeneratorInput - The input type for the generateLyrics function.
 * - LyricsGeneratorOutput - The return type for the generateLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LyricsGeneratorInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  genre: z.string().describe('The genre of the song.'),
  mood: z.string().describe('The mood of the song (e.g., happy, sad, energetic).'),
  theme: z.string().describe('The theme of the song (e.g., love, nature, adventure).'),
});
export type LyricsGeneratorInput = z.infer<typeof LyricsGeneratorInputSchema>;

const LyricsGeneratorOutputSchema = z.object({
  lyrics: z.string().describe('The generated lyrics for the song.'),
});
export type LyricsGeneratorOutput = z.infer<typeof LyricsGeneratorOutputSchema>;

export async function generateLyrics(input: LyricsGeneratorInput): Promise<LyricsGeneratorOutput> {
  return lyricsGeneratorFlow(input);
}

const lyricsPrompt = ai.definePrompt({
  name: 'lyricsPrompt',
  input: {schema: LyricsGeneratorInputSchema},
  output: {schema: LyricsGeneratorOutputSchema},
  prompt: `You are an AI lyricist. Generate lyrics for a song with the following characteristics:

Title: {{{title}}}
Genre: {{{genre}}}
Mood: {{{mood}}}
Theme: {{{theme}}}

Lyrics:`,
});

const lyricsGeneratorFlow = ai.defineFlow(
  {
    name: 'lyricsGeneratorFlow',
    inputSchema: LyricsGeneratorInputSchema,
    outputSchema: LyricsGeneratorOutputSchema,
  },
  async input => {
    const {output} = await lyricsPrompt(input);
    return output!;
  }
);
