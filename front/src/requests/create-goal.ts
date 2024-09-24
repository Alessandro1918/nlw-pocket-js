type CreateGoalRequest = {
  title: string,
  desiredWeeklyFrequency: number
}

export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalRequest) {
  await fetch("http://localhost:4000/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title, 
      desiredWeeklyFrequency
    })
  })
}
