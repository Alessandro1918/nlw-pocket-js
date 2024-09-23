import { createGoalCompletion } from '@/services/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/complete-goal',
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async request => {
      const { goalId } = request.body

      const result = await createGoalCompletion({
        goalId
      })
      return result

      //Or, returning nothing (will also ommit the "Error" message):
      // await createGoalCompletion({
      //   goalId
      // })
    }
  )
}