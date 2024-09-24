import { X } from "lucide-react";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from "./ui/radio-group";
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createGoal } from "../requests/create-goal"
import { useQueryClient } from "@tanstack/react-query"

const createGoalSchema = z.object({
  title: z.string().min(1, "Informe a atividade que deseja cadastrar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7)
})

// type CreateGoalForm = {
//   title: string
//   desiredWeeklyFrequency: number
// }
//Or, simpler:
type CreateGoalForm = z.infer<typeof createGoalSchema>

export function CreateGoal() {

  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(createGoalSchema)
  })

  const queryClient = useQueryClient()

  async function handleCreateGoal(data: CreateGoalForm) {
    try {
      await createGoal({
        title: data.title,
        desiredWeeklyFrequency: data.desiredWeeklyFrequency
      })
  
      queryClient.invalidateQueries({ queryKey: [ "summary" ] })
      queryClient.invalidateQueries({ queryKey: [ "pending-goals" ] })
  
      reset()
  
      alert("Meta craida com sucesso")
    } catch {
      alert("Erro ao criar meta; tente novamente")
    }
  }

  const frequency = [
    {text: "1x na semana", icon: "🥱"},
    {text: "2x na semana", icon: "😐"},
    {text: "3x na semana", icon: "😎"},
    {text: "4x na semana", icon: "😜"},
    {text: "5x na semana", icon: "🤩"},
    {text: "6x na semana", icon: "🥳"},
    {text: "Todos os dias da semana", icon: "🔥"}
  ]

  return (
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          {/* CSS OBS: items-center justify-between: center X axys, push to Y axys ends */}
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose><X className="size-5 text-zinc-600"/></DialogClose>
          </div>

          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar praticando toda semana.
          </DialogDescription>
        </div>

        {/* CSS OBS: flex-1: take up as much space as possible */}
        <form
          className="flex-1 flex flex-col justify-between"
          onSubmit={handleSubmit(handleCreateGoal)}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input 
                id="title" 
                autoFocus 
                placeholder="Praticar exercícios, meditar, etc."
                {...register("title")}
              />
              {
                formState.errors.title && (
                  <p className="text-sm text-red-400">
                    {formState.errors.title.message}
                  </p>
                )
              }
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={1}
                render={({ field }) => {
                  return (
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      value={String(field.value)}
                    >
                      {
                        frequency.map((e, i) => {
                          return (
                            <RadioGroupItem value={String(i+1)}>
                              <RadioGroupIndicator />
                              <span className="text-zinc-300 text-sm font-medium leading-none">{e.text}</span>
                              <span className="text-lg leading-none">{e.icon}</span>
                            </RadioGroupItem>
                          )
                        })
                      }
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <DialogClose asChild>
              <Button className="flex-1" variant="secondary">Fechar</Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}