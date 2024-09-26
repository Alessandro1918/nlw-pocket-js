type CreateGoalRequest = {
  title: string,
  desiredWeeklyFrequency: number
}

export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalRequest) {
  const VITE_BASE_URL_BACK = import.meta.env.VITE_BASE_URL_BACK
  await fetch(`${VITE_BASE_URL_BACK}/goals`, {
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
