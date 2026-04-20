import * as z from "zod";
export const createEventSchema = z.object({
    name: z.string().min(1, "Name is required"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});
export const updateEventSchema = z.object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Name is required"),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});