import * as zod from "zod";
export const loginSchema = zod.object({
    name: zod.string().min(1, "O nome é obrigatório"),
    password: zod.string().min(1, "A senha é obrigatória"),
})