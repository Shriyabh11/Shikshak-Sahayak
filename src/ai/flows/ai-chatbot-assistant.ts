'use server';

/**
 * @fileOverview An AI-powered chatbot assistant for teachers.
 *
 * - aiChatbotAssistant - A function that provides answers to teacher queries.
 * - AiChatbotAssistantInput - The input type for the aiChatbotAssistant function.
 * - AiChatbotAssistantOutput - The return type for the aiChatbotAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotAssistantInputSchema = z.object({
  query: z.string().describe('The query from the teacher.'),
});
export type AiChatbotAssistantInput = z.infer<typeof AiChatbotAssistantInputSchema>;

const AiChatbotAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the teacher query.'),
});
export type AiChatbotAssistantOutput = z.infer<typeof AiChatbotAssistantOutputSchema>;

export async function aiChatbotAssistant(input: AiChatbotAssistantInput): Promise<AiChatbotAssistantOutput> {
  return aiChatbotAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotAssistantPrompt',
  input: {schema: AiChatbotAssistantInputSchema},
  output: {schema: AiChatbotAssistantOutputSchema},
  prompt: `You are an AI-powered chatbot assistant for teachers. Your goal is to provide helpful and informative answers to their queries related to teaching, lesson planning, and other educational topics.

  Question: {{{query}}}
  Answer: `,
});

const aiChatbotAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatbotAssistantFlow',
    inputSchema: AiChatbotAssistantInputSchema,
    outputSchema: AiChatbotAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
