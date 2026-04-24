'use server'
import {db} from "@/db";
import { event_attendance, events, members } from "@/db/schema";
import { and, eq, notInArray, desc } from 'drizzle-orm';

export async function server_getAttendancesForEvent(eventId: string) {
    const result = await db.select().from(event_attendance).where(eq(event_attendance.eventId, eventId));
    return result;
}
export async function server_getAttendancesByMember(memberId: string) {
    const result = await db.select().from(event_attendance).innerJoin(events, eq(events.id, event_attendance.eventId)).where(eq(event_attendance.memberId, memberId)).orderBy(desc(events.date));

    return result;
}
export async function server_createAttendance(memberId: string, eventId: string) {
    await db.insert(event_attendance).values({
        memberId,
        eventId,
        attended: false,
        justified: false
    })
}
export async function server_createBulkAttendance(members: {memberId: string}[], eventId: string) {
    await db.insert(event_attendance).values(members.map(m => ({
        memberId: m.memberId,
        eventId: eventId,
        attended: false,
        justified: false
    })))
}
export async function server_createAttendanceForNotAttended(eventId: string) {
    const existingAttendances = await db.select().from(event_attendance).where(eq(event_attendance.eventId, eventId));
    const existingMemberIds = existingAttendances.map(a => a.memberId);
    const membersWithoutAttendance = await db.select().from(members).where(and(eq(members.active, true),notInArray(members.id, existingMemberIds)));
    await db.insert(event_attendance).values(membersWithoutAttendance.map(m => ({
        memberId: m.id,
        eventId: eventId,
        attended: false,
        justified: false
    })))
}
export async function server_createAttendanceForNotAttendedById(eventId: string, memberId: string) {
    await db.insert(event_attendance).values({
        memberId: memberId,
        eventId: eventId,
        attended: false,
        justified: false
    })
}

export async function server_updateAttendance(memberId: string, eventId: string, attended?: boolean, justified?: boolean, discord?: boolean) {
    const existingAttendance = await db.select().from(event_attendance).where(and(eq(event_attendance.eventId, eventId), eq(event_attendance.memberId, memberId))).limit(1);
    if (!existingAttendance[0]) {
        await server_createAttendanceForNotAttendedById(eventId, memberId);
    }
    const [attendance] = await db.update(event_attendance).set({
        attended,
        justified,
        discord
    }).where(and(eq(event_attendance.memberId, memberId), eq(event_attendance.eventId, eventId))).returning();
    return attendance;
}