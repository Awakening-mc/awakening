'use client'
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { createEventSchema } from "@/forms/events";
import { useForm } from "react-hook-form"
import { FormControl, FormItem, FormField, FormLabel, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import z, { set } from "zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { server_createEvent } from "@/actions/event-actions";
import { useState } from "react";

const eventNames = ["Noc & Rot", "GVG Mermen", "GVG Primavera", "Gruta", "Navio", "Raide de Guilda"]
export default function CreateEventDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const queryClient = useQueryClient()
    const form = useForm({
        resolver: zodResolver(createEventSchema),
        defaultValues: {
            name: "",
            date: new Date().toISOString().slice(0, 16)
        }
    })
    const [isCreating, setIsCreating] = useState(false)
    const createEvent = useMutation({
        mutationFn: async (data: z.infer<typeof createEventSchema>) => {
            setIsCreating(true)
            await server_createEvent(data)
        },
        onSuccess: () => {
            toast.success("Evento criado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ['events'] })
            form.reset()
            setOpen(false)
        },
        onError: (erro: any) => {
            toast.error("Erro ao criar evento.")
        },
        onSettled: () => {
            setIsCreating(false)
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant={"outline"} className={"bg-foreground text-background text-lg px-6"} onClick={() => setOpen(true)}>
                Criar Evento
            </Button>
            <DialogContent>
                <form onSubmit={form.handleSubmit((data) => {
                    createEvent.mutate(data)
                })}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Novo Evento</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="flex flex-col gap-4 mb-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <select {...field} className="border rounded px-2 py-1 w-full">
                                                {eventNames.map((name) => (
                                                    <option key={name} value={name}>
                                                        {name}
                                                    </option>
                                                ))}
                                            </select>

                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="datetime-local" />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                    <DialogFooter>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? "Salvando..." : "Salvar"}
                        </Button>

                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}