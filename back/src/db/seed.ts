import { client, db } from '@/db'
import { goals } from './schema'
import { goalsCompleted } from './schema/goals-completed'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompleted)
  await db.delete(goals)

  //goal 3 is still incompleted, doesn't need to de-structured it and use it on the next insert
  const [goal1, goal2] = await db
    .insert(goals)
    .values([
      {
        title: "Acordar cedo",
        desiredWeeklyFrequency: 1,
      },
      {
        title: "Fazer exercícios",
        desiredWeeklyFrequency: 2,
      },
      {
        title: "Beber 2L de água",
        desiredWeeklyFrequency: 5,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')   //date of the last Sunday

  await db.insert(goalsCompleted).values([
    { goalId: goal1.id, createdAt: startOfWeek.toDate() },                //completed at the same day it was saved (Sunday)
    { goalId: goal2.id, createdAt: startOfWeek.add(1, 'day').toDate() },  //completed one day after it was saved (Sunday + 1 = Monday)
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})