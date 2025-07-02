// src/ai/flows/neural-remix.ts
'use server';

/**
 * @fileOverview A neural remix AI agent.
 *
 * - neuralRemix - A function that handles the neural remix process.
 * - NeuralRemixInput - The input type for the neuralRemix function.
 * - NeuralRemixOutput - The return type for the neuralRemix function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NeuralRemixInputSchema = z.object({
  trackDataUri: z
    .string()
    .describe(
      "An audio track, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  genre: z.string().describe('The target genre for the remix.'),
});
export type NeuralRemixInput = z.infer<typeof NeuralRemixInputSchema>;

const NeuralRemixOutputSchema = z.object({
  remixedTrackDataUri: z
    .string()
    .describe(
      "The remixed audio track, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type NeuralRemixOutput = z.infer<typeof NeuralRemixOutputSchema>;

export async function neuralRemix(input: NeuralRemixInput): Promise<NeuralRemixOutput> {
  return neuralRemixFlow(input);
}

const prompt = ai.definePrompt({
  name: 'neuralRemixPrompt',
  input: {schema: NeuralRemixInputSchema},
  output: {schema: NeuralRemixOutputSchema},
  prompt: `You are a world-class AI music remixer. A user has uploaded a track and wants you to remix it into a different genre.

    The original track is provided as a data URI:
    {{media url=trackDataUri}}

    The target genre is: {{{genre}}}.

    Create a remixed version of the track in the specified genre.  Return the remixed track as a data URI in the 'remixedTrackDataUri' field.
    Ensure the remixed track maintains high audio quality and reflects the characteristics of the target genre.
    Pay attention to harmonic structure and arrangement to create new compelling music.
    Do your best work!`,
});

const neuralRemixFlow = ai.defineFlow(
  {
    name: 'neuralRemixFlow',
    inputSchema: NeuralRemixInputSchema,
    outputSchema: NeuralRemixOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

