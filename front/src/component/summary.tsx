import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../requests/get-summary";

import dayjs from "dayjs"
import ptBR from "dayjs/locale/pt-BR"
import { PendingGoals } from "./pending-goals";
dayjs.locale(ptBR)

export function Summary() {

  const { data } = useQuery({
    queryKey: [ "summary" ],
    queryFn: getSummary,
    staleTime: 1000 * 60  //60s
  })

  if (!data) {
    return null
  }

  const firstDayOfTheWeek = dayjs().startOf("week").format("D MMM")
  const lastDayOfTheWeek = dayjs().endOf("week").format("D MMM")
  const progressPercentage = Math.round(data.completed * 100 / data.total)

  return (
    // CSS OBS: mx-auto: margin left right auto, center at X axys
    // (center entire container, while "align-center" will center elements inside container)
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Image load #1: load image asset */}
          {/* <img src={logo} alt="in.orbit"/> */}

          {/* Image load #2: embed svg to html */}
          <InOrbitIcon />

          {/* CSS OBS: capitalize: upercase first letter */}
          {/* 22 Set - 28 Set */}
          <span className="text-lg font-semibold capitalize">
            {firstDayOfTheWeek} - {lastDayOfTheWeek}
          </span>
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
          <ProgressIndicator style={{width: `${progressPercentage}%`}} />
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou
            <span className="text-zinc-100"> {data?.completed} </span>
            de
            <span className="text-zinc-100"> {data?.total} </span>
            metas essa semana
          </span>
          <span>{`${progressPercentage}%`}</span>
        </div>
      </div>

      <Separator />

      <PendingGoals />

      <div className="flex flex-col gap-6" >
        <h2 className="text-lg font-medium" >Sua semana</h2>

        {/* map(([key, value]) => {...}) */}
        {Object.entries(data.goalsPerDay).map(([date, goals]) => {
          
          const weekDay = dayjs(date).format("dddd")  //Terça-feira
          const formattedDate = dayjs(date).format("D[ de ]MMMM")  //10 de agosto

          return (
            <div key={date} className="flex flex-col gap-4" >
              <h3 className="font-medium" >

                {/* Terça-feira */}
                <span className="capitalize">
                  {weekDay}
                </span>

                {/* (10 de agosto) */}
                <span className="text-zinc-400 text-xs" >
                  {` (${formattedDate})`}
                </span>
              </h3>

              <ul className="flex flex-col gap-3" >
                {goals.map(goal => {

                  const formattedTime = dayjs(goal.completedAt).format("HH:mm")  //8:13h
                  
                  return (
                    <li key={goal.id} className="flex items-center gap-2" >
                      <CheckCircle2 className="size-4 text-pink-500" />

                      <span className="text-sm text-zinc-400" >
                        Você completou
                        {/* "Acordar cedo" */}
                        <span className="text-zinc-100"> {goal.title} </span>
                        as
                        {/* 8:13h */}
                        <span className="text-zinc-100"> {formattedTime}h</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}