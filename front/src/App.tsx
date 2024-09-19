import { Dialog } from "./component/ui/dialog"
import { CreateGoal } from "./component/create-goal"
import { EmptyGoals } from "./component/empty-goals"
import { Summary } from "./component/summary"

export function App() {

  return (
    <Dialog>
      {/* <EmptyGoals /> */}
      <Summary />
      <CreateGoal />
    </Dialog>
  )
}
