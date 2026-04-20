'use client'
import { Form, FormControl, FormItem, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { server_login } from "@/actions/auth-actions";
import { loginSchema } from "@/forms/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function LoginPage() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            name: "",
            password: ""
        }
    });
    const login = useMutation({
        mutationFn: async (data: z.infer<typeof loginSchema>) => {
            const token = await server_login(data)
            if (!token) {
                throw new Error("Login failed");
            }
            try {

                router.push("/dashboard")
            }
            catch (err) {
                console.log(err)
            }

        },
        onSuccess: () => {
        },
        onError: (erro: any) => {
            alert(erro.message || "Erro ao fazer login.")
        }
    })

    return (
        <div className="w-full h-screen bg-gray-800">

            <Card className="w-fit mx-auto mt-8">
                <form
                    className="w-full max-w-sm px-8 flex flex-col">
                    <h1 className="text-2xl font-bold text-center mb-4">Awakening</h1>
                    <Form {...form}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                    <FormControl>
                                        <Input {...field} placeholder="Name" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Password" type="password" />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </Form>
                    <Button onClick={form.handleSubmit((data) => {
                        login.mutate(data)
                    })} className={"mx-auto self-center mt-4 w-1/2"}>Login</Button>
                </form>
            </Card>
        </div>
    );
}