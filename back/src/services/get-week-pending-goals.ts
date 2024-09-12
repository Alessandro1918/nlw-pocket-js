import dayjs from 'dayjs'
import { db } from "@/db"
import { goals, goalsCompleted } from "@/db/schema"
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

export async function getWeekPendingGoals() {

  const firstDayOfTheWeek = dayjs().startOf("week").toDate()
  const lastDayOfTheWeek = dayjs().endOf("week").toDate()

  // Common Table Expression #1:
  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfTheWeek))
  )

  // Common Table Expression #2:
  const goalsCompletedCount = db.$with("goals_completed_count").as(
    db
      .select({
        //Not fields from "goalsCompleted" table, but a custom JSON object:
        //ID of the goal;
        goalId: goalsCompleted.goalId,
        //How many times it was completed;
        //- count(table.field): simply sum the registers. Could work with count(goalsCompleted.goalId).
        //- as("foo"): alias. Mandatory for custom obj keys that aren't table fields, it seems.
        completionCount: count(goalsCompleted.id).as("completionCount")
      })
      .from(goalsCompleted)
      .where(
        and(
          gte(goalsCompleted.createdAt, firstDayOfTheWeek),
          lte(goalsCompleted.createdAt, lastDayOfTheWeek)
        )
      )
      //GROUPBY (often used with "COUNT") is the key here; "goalsCompleted" records have different IDs, but I want to count how many are related to goal id X
      .groupBy(goalsCompleted.goalId)
  )

  const pendingGoals = 
    await db
      .with(goalsCreatedUpToWeek, goalsCompletedCount)
      // .select()
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        // completionCount: goalsCompletedCount.completionCount
        //map null -> default value:
        completionCount: sql`COALESCE(${goalsCompletedCount.completionCount}, 0)`.mapWith(Number)
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalsCompletedCount, 
        eq(
          goalsCreatedUpToWeek.id,
          goalsCompletedCount.goalId
        )
      )

  return { pendingGoals }
  
  //V1: .select(*)
  // result:
  // [
  //   {...},
  //   {
  //     "goals_created_up_to_week": {
  //       "id": "cls2x04c5kynybd1dtshgz3i",
  //       "title": "Dormir +",
  //       "desiredWeeklyFrequency": 7,
  //       "createdAt": "2024-09-11T19:14:08.792Z"
  //     },
  //     "goals_completed_count": {
  //       "goalId": "cls2x04c5kynybd1dtshgz3i",
  //       "completionCount": 3
  //     }
  //   },
  //   ...
  // ]

  //V2: .select(some fields only)
  // result:
  // [
  //   {...},
  //   {
  //     "id": "cls2x04c5kynybd1dtshgz3i",
  //     "title": "Dormir +",
  //     "desiredWeeklyFrequency": 7,
  //     "completionCount": 3
  //   },
  //   ...
  // ]
}