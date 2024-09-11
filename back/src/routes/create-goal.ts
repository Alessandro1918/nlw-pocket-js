import { createGoal } from '@/services/create-goal'
// import type { FastifyInstance } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

//V1: without FastifyPluginAsyncZod
// export async function createGoalRoute(app: FastifyInstance) {
//   app.post("/goals", async request => {
    
//     const createGoalSchema = z.object({
//       title: z.string(),
//       desiredWeeklyFrequency: z.number().int().min(1).max(7),
//     })

//     const body = createGoalSchema.parse(request.body)

//     const { goal } = await createGoal({
//       title: body.title,
//       desiredWeeklyFrequency: body.desiredWeeklyFrequency,
//     })

//     return { goalId: goal.id }

//   })
// }

//V2: with FastifyPluginAsyncZod
export const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    //1st param:
    '/goals',

    //2nd param:
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
      },
    },

    //3rd param:
    async request => {
      const { title, desiredWeeklyFrequency } = request.body

      const { goal } = await createGoal({
        title,
        desiredWeeklyFrequency,
      })

      return { goalId: goal.id }
    }
  )
}