import fastify from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import fastifyCors from "@fastify/cors"
import { createGoalRoute } from "./routes/create-goal"
import { getWeekPendingGoalsRoute } from "./routes/get-week-pending-goals"
import { createGoalCompletionRoute } from "./routes/create-goal-completion"
import { getWeekSummaryRoute } from "./routes/get-week-summary"

const PORT = Number(process.env.PORT)
const HOST = process.env.HOST

//V1: without fastify-type-provider-zod
// const app = fastify()

//V2: with fastify-type-provider-zod
const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: "*"
})

app.get("/", () => {return "Hello, world!"})

app.register(createGoalRoute)
app.register(getWeekPendingGoalsRoute)
app.register(createGoalCompletionRoute)
app.register(getWeekSummaryRoute)

app
  .listen({port: PORT, host: HOST})
  .then(() => {console.log(`Server running on http://${HOST}:${PORT}`)})