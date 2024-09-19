import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { OutlineButton } from "./ui/outline-button";

export function Summary() {
  return (
    // mx-auto: margin left right auto, center at X axys
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Image load #1: load image asset */}
          {/* <img src={logo} alt="in.orbit"/> */}

          {/* Image load #2: embed svg to html */}
          <InOrbitIcon />

          <span className="text-lg font-semibold">5 a 10 de agosto</span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            < Plus className="size-4"/>
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        {/* TODO: props value={1} and max={15} doesn't seem to work */}
        <Progress value={1} max={15}>
          <ProgressIndicator style={{width: "50%"}} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou
            <span className="text-zinc-100"> 8 </span>
            de
            <span className="text-zinc-100"> 15 </span>
            metas essa semana
          </span>
          <span>50%</span>
        </div>
      </div>

      <Separator />

      {/* flex-wrap: break line to add next button to next line */}
      <div className="flex gap-3 flex-wrap">
        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Meditar
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Nadar
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Praticar Bateria
        </OutlineButton>

        <OutlineButton>
          <Plus className="size-4 text-zinc-600" />
          Dormir cedo
        </OutlineButton>
      </div>

      <div className="flex flex-col gap-6" >
        <h2 className="text-lg font-medium" >Sua semana</h2>

        <div className="flex flex-col gap-4" >
          <h3 className="font-medium" >
            Domingo
            <span className="text-zinc-400 text-xs" > (10 de agosto)</span>
          </h3>

          <ul className="flex flex-col gap-3" >
            <li className="flex items-center gap-2" >
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400" >
                Você completou
                <span className="text-zinc-100" > "Acordar cedo" </span>
                as
                <span className="text-zinc-100" > 08:13h</span>
              </span>
            </li>

            <li className="flex items-center gap-2" >
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400" >
                Você completou
                <span className="text-zinc-100" > "Acordar cedo" </span>
                as
                <span className="text-zinc-100" > 08:13h</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4" >
          <h3 className="font-medium" >
            Segunda
            <span className="text-zinc-400 text-xs" > (11 de agosto)</span>
          </h3>

          <ul className="flex flex-col gap-3" >
            <li className="flex items-center gap-2" >
              <CheckCircle2 className="size-4 text-pink-500" />

              <span className="text-sm text-zinc-400" >
                Você completou
                <span className="text-zinc-100" > "Acordar cedo" </span>
                as
                <span className="text-zinc-100" > 08:13h</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}