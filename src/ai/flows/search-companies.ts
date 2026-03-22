'use server';
/**
 * @fileOverview An AI flow to search for real-world companies based on a prefix.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchCompaniesInputSchema = z.object({
  query: z.string().describe('The search term or prefix for the company name.'),
});

const SearchCompaniesOutputSchema = z.object({
  companies: z.array(z.string()).describe('A list of matching or relevant company names.'),
});

export type SearchCompaniesOutput = z.infer<typeof SearchCompaniesOutputSchema>;

export async function searchCompanies(query: string): Promise<SearchCompaniesOutput> {
  return searchCompaniesFlow({ query });
}

const searchCompaniesFlow = ai.defineFlow(
  {
    name: 'searchCompaniesFlow',
    inputSchema: SearchCompaniesInputSchema,
    outputSchema: SearchCompaniesOutputSchema,
  },
  async (input) => {
    const {output} = await ai.generate({
      prompt: `You are a business directory assistant. Generate a list of 5-8 real-world companies that match or are highly relevant to the search query: "${input.query}". 
      Focus on major global corporations, tech firms, and well-known startups. 
      Return only the names of the companies.`,
      output: { schema: SearchCompaniesOutputSchema }
    });
    return output || { companies: [] };
  }
);
