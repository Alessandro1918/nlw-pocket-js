import { client, db } from '@/db'
import { goals } from './schema'
import { goalsCompleted } from './schema/goals-completed'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalsCompleted)
  await db.delete(goals)

  //goal 3 will be seeded as "still incompleted", so I don't need to de-structured it to use it on the next insert
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

  await db.insert(goalsCompleted).values([
    { goalId: goal1.id, createdAt: goal1.createdAt }, 
    { goalId: goal2.id, createdAt: dayjs(goal2.createdAt).add(1, "day").add(42, "minutes").toDate() },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})