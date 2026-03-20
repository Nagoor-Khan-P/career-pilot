'use server';
/**
 * @fileOverview An AI agent that provides tailored interview preparation tips.
 *
 * - getInterviewPreparationTips - A function that handles the interview preparation tips generation process.
 * - InterviewPreparationTipsInput - The input type for the getInterviewPreparationTips function.
 * - InterviewPreparationTipsOutput - The return type for the getInterviewPreparationTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewPreparationTipsInputSchema = z.object({
  companyName: z.string().describe('The name of the company for the interview.'),
  role: z.string().describe('The job role for which the interview is being conducted.'),
  interviewStage: z
    .string()
    .describe('The current stage of the interview (e.g., Phone Screen, Technical Interview, Final Interview).'),
});
export type InterviewPreparationTipsInput = z.infer<typeof InterviewPreparationTipsInputSchema>;

const InterviewPreparationTipsOutputSchema = z.object({
  tips: z.string().describe('A comprehensive list of tailored interview preparation tips.'),
});
export type InterviewPreparationTipsOutput = z.infer<typeof InterviewPreparationTipsOutputSchema>;

export async function getInterviewPreparationTips(
  input: InterviewPreparationTipsInput
): Promise<InterviewPreparationTipsOutput> {
  return interviewPreparationTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewPreparationTipsPrompt',
  input: {schema: InterviewPreparationTipsInputSchema},
  output: {schema: InterviewPreparationTipsOutputSchema},
  prompt: `You are an expert career coach specializing in interview preparation. Your goal is to help the user succeed in their job search.

Provide tailored and actionable interview preparation tips for a '{{{interviewStage}}}' at '{{{companyName}}}' for the '{{{role}}}' position.

Focus on key areas relevant to this specific interview stage, the company's potential culture, and the responsibilities typically associated with the role. Consider common questions for this stage, required skills, and how to present oneself effectively.

Provide at least 3-5 distinct and detailed tips. Structure your response clearly with bullet points or numbered lists for readability.`, 
});

const interviewPreparationTipsFlow = ai.defineFlow(
  {
    name: 'interviewPreparationTipsFlow',
    inputSchema: InterviewPreparationTipsInputSchema,
    outputSchema: InterviewPreparationTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
