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
  const response = await fetch("http://localhost:4000/summary")
  const data = await response.json()
  return data.summary
}