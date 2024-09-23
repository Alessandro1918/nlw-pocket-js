import { Plus } from "lucide-react";
import { OutlineButton } from "./ui/outline-button";
import { useQuery } from "@tanstack/react-query";
import { getPendingGoals } from "../requests/get-pending-goals";

export function PendingGoals() {

  const { data } = useQuery({
    queryKey: [ "pending-goals" ],
    queryFn: getPendingGoals
  })

  if (!data) {
    return null
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