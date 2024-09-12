import dayjs from "dayjs"
import { and, count, eq, gte, lte, sql } from "drizzle-orm"
import { db } from "@/db"
import { goals, goalsCompleted } from "@/db/schema"

interface CreateGoalCompletionInterface {
  goalId: string
}

export async function createGoalCompletion({
  goalId, 
}: CreateGoalCompletionInterface) {

  const firstDayOfTheWeek = dayjs().startOf("week").toDate()
  const lastDayOfTheWeek = dayjs().endOf("week").toDate()

  const goalsCompletedCount = db.$with("goals_completed_count").as(
    db
      .select({
        goalId: goalsCompleted.goalId,
        completionCount: count(goalsCompleted.id).as("completionCount")
      })
      .from(goalsCompleted)
      .where(
        and(
          gte(goalsCompleted.createdAt, firstDayOfTheWeek),
          lte(goalsCompleted.createdAt, lastDayOfTheWeek),
          eq(goalsCompleted.goalId, goalId)
        )
      )
      .groupBy(goalsCompleted.goalId)
  )

  const result = 
    await db
      .with(goalsCompletedCount)
      .select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql`COALESCE(${goalsCompletedCount.completionCount}, 0)`.mapWith(Number)
      })
      .from(goals)
      .leftJoin(
        goalsCompletedCount, 
        eq(
          goalsCompletedCount.goalId,
          goals.id,
        )
      )
      .where(
        eq(
          goals.id,
          goalId
        )
      )
  
  // [
  //   {
  //     "desiredWeeklyFrequency": 7,
  //     "completionCount": 3
  //   }
  // ]

  const { completionCount, desiredWeeklyFrequency } = result[0]

  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error("Goal already completed this week!")
  }

  const newRow = await db
    .insert(goalsCompleted)
    .values({goalId})
    .returning()
  
  const goalCompletion = newRow[0]

  return { goalCompletion }
}
