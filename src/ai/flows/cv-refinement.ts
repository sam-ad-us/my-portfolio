'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining CV text using AI to make it more appealing to potential employers.
 *
 * - refineCv - A function that takes CV text as input and returns refined CV text.
 * - RefineCvInput - The input type for the refineCv function.
 * - RefineCvOutput - The return type for the refineCv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineCvInputSchema = z.object({
  cvText: z
    .string()
    .describe('The text content of the CV to be refined.'),
});
export type RefineCvInput = z.infer<typeof RefineCvInputSchema>;

const RefineCvOutputSchema = z.object({
  refinedCvText: z
    .string()
    .describe('The refined text content of the CV, optimized for clarity and appeal.'),
});
export type RefineCvOutput = z.infer<typeof RefineCvOutputSchema>;

export async function refineCv(input: RefineCvInput): Promise<RefineCvOutput> {
  return refineCvFlow(input);
}

const refineCvPrompt = ai.definePrompt({
  name: 'refineCvPrompt',
  input: {schema: RefineCvInputSchema},
  output: {schema: RefineCvOutputSchema},
  prompt: `You are an expert resume writer. Please refine the following CV text to improve its clarity, grammar, and appeal to potential employers. Highlight key skills and experiences.

CV Text:
{{{cvText}}}`,
});

const refineCvFlow = ai.defineFlow(
  {
    name: 'refineCvFlow',
    inputSchema: RefineCvInputSchema,
    outputSchema: RefineCvOutputSchema,
  },
  async input => {
    const {output} = await refineCvPrompt(input);
    return output!;
  }
);
