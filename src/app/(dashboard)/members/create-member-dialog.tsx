'use client'
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { createMemberSchema } from "@/forms/members";
import { useForm } from "react-hook-form"
import { FormControl, FormItem, FormField, FormLabel, Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IClass } from "../../../../types";
import { create } from "domain";
import { server_createMember } from "@/actions/member-actions";
import z from "zod";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function CreateMemberDialog({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const queryClient = useQueryClient()
    const classes: IClass[] = ["DK", "Necro", "Lock", "Charmer", "Ceifa", "BRB", "Xamã", "Rogue", "CCQ", "Hunter"]
    const form = useForm({
        resolver: zodResolver(createMemberSchema),
        defaultValues: {
            name: "",
            class: classes[0],
            level: 34
        }
    })
    const createMember = useMutation({
        mutationFn: async (data: z.infer<typeof createMemberSchema>) => {
            await server_createMember(data)
        },
        onSuccess: () => {
            toast.success("Membro criado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ['membros'] })
            form.reset()
            setOpen(false)
        },
        onError: (erro: any) => {
            toast.error("Erro ao criar membro.")
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button variant={"outline"} onClick={() => setOpen(true)}>
                Criar Membro
            </Button>
            <DialogContent>
                <form onSubmit={form.handleSubmit((data) => {
                    createMember.mutate(data)
                })}>
                    <DialogHeader className="mb-8">
                        <DialogTitle>Criar Membro</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <div className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                                onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Form>
                    <DialogFooter>
                        <Button type="submit">Salvar</Button>

                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}