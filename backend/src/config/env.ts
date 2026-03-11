import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // AI - Groq
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required'),

  // Email - Gmail SMTP
  SMTP_USER: z.string().email('SMTP_USER must be a valid Gmail address'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS (App Password) is required'),

  // Security
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
