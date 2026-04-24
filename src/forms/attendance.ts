import z from 'zod';

export const createAttendanceSchema = z.object({
    eventId: z.string().min(1, "Event ID is required"),
    memberId: z.string().min(1, "Member ID is required"),
    attended: z.boolean().default(false),
    justified: z.boolean().default(false),
    discord: z.boolean().default(false)
});
export const updateAttendanceSchema = z.object({
    id: z.string().min(1, "ID is required"),
    eventId: z.string().min(1, "Event ID is required"),
    memberId: z.string().min(1, "Member ID is required"),
    attended: z.boolean().default(false),
    justified: z.boolean().default(false),
    discord: z.boolean().default(false)
});