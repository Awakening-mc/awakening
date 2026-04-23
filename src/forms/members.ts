import { Phone } from "lucide-react";
import * as z from "zod";

const classEnum = z.enum(["DK", "Necro", "Lock", "Charmer", "Ceifa", "BRB", "Xamã", "Rogue", "CCQ", "Hunter"])
export const createMemberSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório").trim().max(10, "O nome deve ter no máximo 10 caracteres"),
    class: classEnum,
    phone: z.string().max(17, "O número de telefone deve ter no máximo 17 caracteres").optional(),
    level: z.number().int().min(1, "O nível deve ser pelo menos 1").max(34, "O nível deve ser no máximo 34"),
});
export const updateMemberSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, "O nome é obrigatório").trim().max(10, "O nome deve ter no máximo 10 caracteres"),
    class: classEnum,
    phone: z.string().max(17, "O número de telefone deve ter no máximo 17 caracteres").optional(),
    level: z.number().int().min(1, "O nível deve ser pelo menos 1").max(34, "O nível deve ser no máximo 34"),
});