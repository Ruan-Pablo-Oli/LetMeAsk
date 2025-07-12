import { z } from 'zod'

const envScheme = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url().startsWith('postgres://'),
  GEMINI_API_KEY: z.string(),
})

export const env = envScheme.parse(process.env)
