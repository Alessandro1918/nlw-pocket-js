import { db } from "@/db"
import { goals, goalsCompleted } from "@/db/schema"
import dayjs from "dayjs"
import { and, count, eq, gte, lte, sql } from 'drizzle-orm'

export async function getWeekSummary() {

  const firstDayOfTheWeek = dayjs().startOf("week").toDate()
  const lastDayOfTheWeek = dayjs().endOf("week").toDate()
  
  // Common Table Expression #1
  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        lte(goals.createdAt, lastDayOfTheWeek)
      )
  )

  // const goalsCompletedCount = db.$with("goals_completed_count").as(
  //   db
  //     .select({
  //       goalId: goalsCompleted.goalId,
  //       completionCount: count(goalsCompleted.id).as("completionCount")
  //     })
  //     .from(goalsCompleted)
  //     .where(
  //       and(
  //         gte(goalsCompleted.createdAt, firstDayOfTheWeek),
  //         lte(goalsCompleted.createdAt, lastDayOfTheWeek)
  //       )
  //     )
  //     .groupBy(goalsCompleted.goalId)
  // )

  //Up until then, it's a copy-paste from get-week-pending-goals service. But I want to separate the completions by week day (how many on Sunday, Monday, Tuesday...)

  // Common Table Expression #2
  const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
    db
      .select({
        id: goalsCompleted.id,
        title: goals.title,
        completedAt: goalsCompleted.createdAt,                                          //date + time
        completedAtDate: sql`DATE(${goalsCompleted.createdAt})`.as("completedAtDate")   //just date
      })
      .from(goalsCompleted)
      .innerJoin(goals, eq(goals.id, goalsCompleted.goalId))
      .where(
        and(
          gte(goalsCompleted.createdAt, firstDayOfTheWeek),
          lte(goalsCompleted.createdAt, lastDayOfTheWeek)
        )
      )
  )

  // Common Table Expression #3
  //Get output from Common Table Expression #2, GROUPBY day
  const goalsCompletedByWeekDay = db.$with("goals_completed_by_week_day").as(
    db
      .select({
        completedAtDate: goalsCompletedInWeek.completedAtDate,
        // JSON_AGG[regate]: new array
        // JSON_BUILD_OBJ: new javascript obj (JSON)
        completions: sql`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as("completions")
      })
      .from(goalsCompletedInWeek)
      .groupBy(goalsCompletedInWeek.completedAtDate)
  )

  // Optional, but helps Typescript infer the type of this new SQL collumn
  // Record: object
  // []: array
  // GoalsPerDay: Array of objects; each object with a key (a date string ) and a {isDataView, title, createdAt}
  type GoalsPerDay = Record<string, {
    id: string,
    title: string,
    completedAt: string
  }[]>

  const result = 
    await db
      .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
      // .select()    //V1
      .select({       //V2
        //all "goalCompleted" records:
        completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
        //not all "goal" records, but their desired frequency:
        total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(Number),
        //"completed" and "total" were returning 2x, because "goalsCompletedByWeekDay" returned 2 objects inside array.
        //So, I used "JSON_OBJECT_AGG" (instead of "JSON_BUILD_OBJECT") to aggregate the results.
        goalsPerDay: sql<GoalsPerDay>`
          JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completedAtDate}, ${goalsCompletedByWeekDay.completions}
          )
        `
      })
      .from(goalsCompletedByWeekDay)
      
      //V1:
      // {
      //   "summary": [
      //     {
      //       "completedAtDate": "2024-09-15",
      //       "completions": [
      //         {
      //           "id": "ogp4ra5uo5ud2ge3krt82uih",
      //           "title": "Acordar cedo",
      //           "completedAt": "2024-09-15T03:00:00+00:00"
      //         }
      //       ]
      //     },
      //     {...}
      //   ]
      // }

      //V2:
      // {
      //   "summary": [
      //     {
      //       "completed": 3,
      //       "total": 8,
      //       "goalsPerDay": {
      //         "2024-09-15": [
      //           {
      //             "id": "ogp4ra5uo5ud2ge3krt82uih",
      //             "title": "Acordar cedo",
      //             "completedAt": "2024-09-15T03:00:00+00:00"
      //           }
      //         ],
      //         "2024-09-16": [
      //           {
      //             "id": "iinga29b6izgff9cunhdzncw",
      //             "title": "Fazer exercícios",
      //             "completedAt": "2024-09-16T19:03:20.344445+00:00"
      //           },
      //           {
      //             "id": "zlmyg47y3usvnlb7fvs2safg",
      //             "title": "Fazer exercícios",
      //             "completedAt": "2024-09-16T03:00:00+00:00"
      //           }
      //         ]
      //       }
      //     }
      //   ]
      // }

  return { summary: result[0] }

}