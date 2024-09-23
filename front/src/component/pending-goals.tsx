import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../requests/get-pending-goals";
import { createGoalCompletion } from "../requests/create-goal-completion";

export function PendingGoals() {

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: [ "pending-goals" ],
    queryFn: getPendingGoals
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId)

    //will tell these queries to be re-fetched:
    queryClient.invalidateQueries({ queryKey: [ "summary" ] })
    queryClient.invalidateQueries({ queryKey: [ "pending-goals" ] })
  }

  return (
    // CSS OBS: flex-wrap: break line to add next button to next line
    <div className="flex gap-3 flex-wrap">
      {
        data.map(goal => {
          return (
            <OutlineButton 
              key={goal.id}
              disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
              onClick={() => handleCompleteGoal(goal.id)}
            >
              <Plus className="size-4 text-zinc-600" />
              {goal.title}
            </OutlineButton>
          )
        })
      }
    </div>
  )
}