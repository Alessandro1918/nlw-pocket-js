export async function createGoalCompletion(goalId: string) {
  const VITE_BASE_URL_BACK = import.meta.env.VITE_BASE_URL_BACK
  await fetch(`${VITE_BASE_URL_BACK}/complete-goal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      goalId
    })
  })
}
