import Groq from 'groq-sdk';
import { env } from '../config/env';
import { ParsedRow } from './parser.service';

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export const generateSummary = async (data: ParsedRow[]): Promise<string> => {
  const dataSnapshot = data.slice(0, 50); // limit rows to avoid token overflow
  const totalRows = data.length;

  const prompt = `You are a senior sales analyst. Analyze the following sales data and produce a clear, actionable narrative summary.

Data contains ${totalRows} total rows. Here is a sample (first ${dataSnapshot.length} rows):

${JSON.stringify(dataSnapshot, null, 2)}

Provide:
1. **Key Metrics** — total revenue, average order value, top products/categories
2. **Trends** — notable patterns, growth areas, declining segments
3. **Insights** — actionable recommendations for the sales team
4. **Summary** — a 2-3 sentence executive overview

Format the response in clean Markdown suitable for email delivery.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a professional sales data analyst. Be concise, data-driven, and actionable.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error('AI returned an empty response');
  }

  return content;
};
