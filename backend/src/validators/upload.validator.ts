import { z } from 'zod';

export const uploadBodySchema = z.object({
  email: z.string().email('A valid email address is required'),
});
