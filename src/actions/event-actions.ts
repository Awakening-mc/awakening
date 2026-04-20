'use server'
import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { events } from "@/db/schema";
import { server_createAttendanceForNotAttended } from "./attendance-actions";

export async function server_createEvent(data: {name: string, date: string}){
    const [evt] = await db.insert(events).values({
        name: data.name,
        date: new Date(data.date)
    }).returning();
    await server_createAttendanceForNotAttended(evt.id);
}

export async function server_getEvents() {
    const result = await db.select().from(events).orderBy(desc(events.date));
    return result;
}
export async function server_getEventById(id: string) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
}