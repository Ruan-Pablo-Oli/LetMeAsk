import {z} from 'zod'

const envScheme = z.object({
    PORT: z.coerce.number().default(3333),
})

export const env = envScheme.parse(process.env)
