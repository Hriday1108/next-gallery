'use server';
/**
 * @fileOverview AI-powered task suggestion flow for interns.
 *
 * - suggestTasks - A function that generates a list of suggested tasks for an intern based on their internship description and skills.
 * - SuggestTasksInput - The input type for the suggestTasks function.
 * - SuggestTasksOutput - The return type for the suggestTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTasksInputSchema = z.object({
  internshipDescription: z.string().describe('The description of the internship role.'),
  skills: z.string().describe('The skills of the intern.'),
});
export type SuggestTasksInput = z.infer<typeof SuggestTasksInputSchema>;

const SuggestTasksOutputSchema = z.object({
  tasks: z.array(z.string()).describe('A list of suggested tasks for the intern.'),
});
export type SuggestTasksOutput = z.infer<typeof SuggestTasksOutputSchema>;

export async function suggestTasks(input: SuggestTasksInput): Promise<SuggestTasksOutput> {
  return suggestTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTasksPrompt',
  input: {schema: SuggestTasksInputSchema},
  output: {schema: SuggestTasksOutputSchema},
  prompt: `You are an AI assistant helping interns understand potential contributions and structure their initial goals.

  Based on the provided internship description and the intern's skills, generate a list of suggested tasks the intern can perform.

  Internship Description: {{{internshipDescription}}}
  Intern Skills: {{{skills}}}

  Tasks:`,
});

const suggestTasksFlow = ai.defineFlow(
  {
    name: 'suggestTasksFlow',
    inputSchema: SuggestTasksInputSchema,
    outputSchema: SuggestTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
