//Hover mouse @ back/src/services/get-week-summary.ts "summary" result, copy it's type
type SummaryResponse = {
  completed: number;
  total: number;
  goalsPerDay: Record<string, {
    id: string;
    title: string;
    completedAt: string;
  }[]>;
}

export async function getSummary(): Promise<SummaryResponse> {
  const VITE_BASE_URL_BACK = import.meta.env.VITE_BASE_URL_BACK
  // const response = await fetch("http://localhost:4000/summary")
  const response = await fetch(`${VITE_BASE_URL_BACK}/summary`)
  const data = await response.json()
  return data.summary
}