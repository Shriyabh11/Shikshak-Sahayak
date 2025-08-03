// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Lesson plan generation AI agent.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The topic of the lesson plan.'),
  grade: z.number().describe('The grade level for the lesson plan.'),
  curriculum: z.string().describe('The curriculum to align the lesson plan with.'),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const GenerateLessonPlanOutputSchema = z.object({
  lessonPlanSuggestions: z.array(
    z.object({
      title: z.string().describe('The title of the lesson plan suggestion.'),
      description: z.string().describe('A brief description of the lesson plan suggestion.'),
      relevanceToCurriculum: z
        .string()
        .describe('How relevant the lesson plan is to the specified curriculum.'),
    })
  ).describe('An array of lesson plan suggestions.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: {schema: GenerateLessonPlanInputSchema},
  output: {schema: GenerateLessonPlanOutputSchema},
  prompt: `You are an AI assistant designed to help teachers generate lesson plans.

  Given the following information, generate lesson plan suggestions that are appropriate for the specified grade and aligned with the curriculum.

  Topic: {{{topic}}}
  Grade: {{{grade}}}
  Curriculum: {{{curriculum}}}

  Consider different teaching methodologies, activities, and assessment methods.

  Each lesson plan suggestion should include a title, a brief description, and an assessment of its relevance to the specified curriculum.

  Format the output as a JSON array of lesson plan suggestions.
  `,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
