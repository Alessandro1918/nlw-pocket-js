import { Dialog } from "./component/ui/dialog"
import { CreateGoal } from "./component/create-goal"
import { EmptyGoals } from "./component/empty-goals"
import { Summary } from "./component/summary"
// import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getSummary } from "./requests/get-summary"

export function App() {

  //V1 - useState, useEffect
  // const [ summary, setSummary ] = useState<SummaryResponse | null>(null)
  // useEffect(() => {
  //   fetch("http://localhost:4000/summary")
  //     .then(response => {return response.json()})
  //     .then(data => {setSummary(data.summary)})
  // }, [])

  //V2 - useQuery
  // const { data } = useQuery<SummaryResponse>({
  //   queryKey: [ "summary" ],
  //   queryFn: async () => {
  //     const response = await fetch("http://localhost:4000/summary")
  //     const data = await response.json()
  //     return data.summary
  //   }
  // })

  const { data } = useQuery({
    queryKey: [ "summary" ],
    queryFn: getSummary,
    staleTime: 1000 * 60  //60s
  })

  return (
    <Dialog>
      {
        // (summary && summary.total > 0)
        (data && data.total > 0) 
          ? <Summary /> 
          : <EmptyGoals />
      }      
      <CreateGoal />
    </Dialog>
  )
}
