'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { updateMemberSchema } from "@/forms/members";
import { useForm } from "react-hook-form"
import { FormControl, FormItem, FormField, FormLabel, Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IClass } from "../../../../types";
import { Member } from "@/db/schema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { server_updateMember } from "@/actions/member-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";


export default function UpdateMemberDialog({ member }: { member: Member }) {
    const queryClient = useQueryClient()
    const classes: IClass[] = ["DK", "Necro", "Lock", "Charmer", "Ceifa", "BRB", "Xamã", "Rogue", "CCQ", "Hunter"]
    const form = useForm({
        resolver: zodResolver(updateMemberSchema),
        defaultValues: {
            id: member.id,
            name: member.name,
            class: member.class,
            phone: member.phone || "",
            level: member.level
        }
    })
    const updateMember = useMutation({
        mutationFn: async (data: z.infer<typeof updateMemberSchema>) => {
            await server_updateMember(data)
        },
        onSuccess: () => {
            toast.success("Membro alterado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ['membros'] })
            setOpen(false)
        },
        onError: (erro: any) => {
            toast.error("Erro ao alterar membro.")
        }
    })
    const [open, setOpen] = useState(false)
    function cancelar(){
        form.reset()
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant={"outline"} size={"icon"} className={"rounded-full cursor-pointer"} onClick={() => setOpen(true)}>
                <Pencil size={16} />
            </Button>
            <DialogContent>
                <form onSubmit={form.handleSubmit((data) => {
                    updateMember.mutate(data)
                })}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Criar Membro</DialogTitle>
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
                                            <Input maxLength={10} {...field} onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nível</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input
                                                maxLength={15}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.replace(/\s/g, ''))}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Classe</FormLabel>
                                        <FormControl>
                                            <select {...field} className="w-full border rounded-md p-2">
                                                {classes.map((cls) => (
                                                    <option key={cls} value={cls}>
                                                        {cls}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>

                        <Button variant="outline" onClick={cancelar}>
                            Cancelar
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}