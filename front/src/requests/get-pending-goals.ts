type PendingGoalsResponse = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}[]

// export async function getPendingGoals() {
export async function getPendingGoals():Promise<PendingGoalsResponse> {
  const VITE_BASE_URL_BACK = import.meta.env.VITE_BASE_URL_BACK
  const response = await fetch(`${VITE_BASE_URL_BACK}/pending-goals`)
  const data = await response.json()
  return data.pendingGoals
}