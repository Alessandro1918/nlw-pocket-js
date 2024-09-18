import { Dialog } from "./component/ui/dialog"
import { CreateGoal } from "./component/create-goal"
import { EmptyGoals } from "./component/empty-goals"

export function App() {

  return (
    <Dialog>
      <EmptyGoals />
      <CreateGoal />
    </Dialog>
  )
}
