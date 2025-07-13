import { and, eq, sql } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { id } from 'zod/v4/locales'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { generateEmbeddings } from '../../services/gemini.ts'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { question } = request.body
      const { roomId } = request.params

      const embeddings = generateEmbeddings(question)

      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddings})`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            eq(schema.audioChunks.roomId, roomId),
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddings}) > 0.7`
          )
        )
        .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddings}`)
        .limit(3)

      return chunks

      // const result = await db
      //   .insert(schema.questions)
      //   .values({
      //     roomId,
      //     question,
      //   })
      //   .returning()

      // const insertedQuestion = result[0]

      // if (!insertedQuestion) {
      //   throw new Error('Failed to create new question')
      // }

      // return reply.status(201).send({ questionId: insertedQuestion.id })
    }
  )
}
