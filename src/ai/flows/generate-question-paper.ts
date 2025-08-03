'use server';

/**
 * @fileOverview A question paper generation AI agent.
 *
 * - generateQuestionPaper - A function that handles the question paper generation process.
 * - GenerateQuestionPaperInput - The input type for the generateQuestionPaper function.
 * - GenerateQuestionPaperOutput - The return type for the generateQuestionPaper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionPaperInputSchema = z.object({
  grade: z.string().describe('The grade level for the question paper.'),
  subject: z.string().describe('The subject of the question paper.'),
  topic: z.string().describe('The topic of the question paper.'),
  questionType: z.string().describe('The type of questions to include (e.g., multiple choice, essay).'),
  difficultyLevel: z.string().describe('The difficulty level of the questions (e.g., easy, medium, hard).'),
});
export type GenerateQuestionPaperInput = z.infer<typeof GenerateQuestionPaperInputSchema>;

const GenerateQuestionPaperOutputSchema = z.object({
  questionPaper: z.string().describe('The generated question paper.'),
});
export type GenerateQuestionPaperOutput = z.infer<typeof GenerateQuestionPaperOutputSchema>;

export async function generateQuestionPaper(input: GenerateQuestionPaperInput): Promise<GenerateQuestionPaperOutput> {
  return generateQuestionPaperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionPaperPrompt',
  input: {schema: GenerateQuestionPaperInputSchema},
  output: {schema: GenerateQuestionPaperOutputSchema},
  prompt: `You are an expert teacher specializing in creating question papers.

You will use the following information to generate a question paper.

Grade: {{{grade}}}
Subject: {{{subject}}}
Topic: {{{topic}}}
Question Type: {{{questionType}}}
Difficulty Level: {{{difficultyLevel}}}

Generate a question paper with the specified parameters. The question paper should include a variety of questions that are appropriate for the grade level, subject, and topic. The questions should also be of the specified type and difficulty level.

Question Paper:`, 
});

const generateQuestionPaperFlow = ai.defineFlow(
  {
    name: 'generateQuestionPaperFlow',
    inputSchema: GenerateQuestionPaperInputSchema,
    outputSchema: GenerateQuestionPaperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
