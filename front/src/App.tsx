import { Plus } from "lucide-react"
import logo from "./assets/in-orbit-logo.svg"
import letsStart from "./assets/rocket-launch-illustration.svg"
import { Button } from "./component/ui/button"

export function App() {

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logo} alt="in.orbit"/>
      <img src={letsStart} alt="lets start"/>
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
      </p>
      <Button>
        < Plus className="size-4"/>
        Cadastrar metae
      </Button>
    </div>
  )
}
