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
            if(!token) {
                throw new Error("Login failed");
            }
            try{

                router.push("/dashboard")
            }
            catch(err){
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
        <div className="h-full">
            <form
                onSubmit={form.handleSubmit((data) => {
                    login.mutate(data)
                })}
                className="w-full max-w-sm mx-auto mt-20">
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
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
                <button>Login</button>
            </form>
        </div>
    );
}