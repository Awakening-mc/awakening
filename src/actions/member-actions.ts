'use server'
import { db } from "@/db";
import { asc, desc, eq } from "drizzle-orm";
import { members } from "@/db/schema";
import { IClass } from "../../types";
import { revalidatePath } from "next/cache";
export async function server_createMember(data: {name: string, class: IClass, level: number}) {
    const existingMember = await db.select().from(members).where(eq(members.name, data.name)).limit(1);
    if(existingMember.length > 0) {
        throw new Error("Já existe um membro com esse nome.")
    }
    const member = await db.insert(members).values(data).returning();
    revalidatePath('/members')
    return member;
}
export async function server_getMembers() {
 
    return db.select().from(members).orderBy(desc(members.active), asc(members.name));;
    
}
export async function server_getMemberById(id: string) {
    return db.select().from(members).where(eq(members.id, id)).limit(1);
}

export async function server_switchMember(id: string) {
    const member = await db.select().from(members).where(eq(members.id, id)).limit(1);
    if(!member[0]) throw new Error("Membro não encontrado");
    const [upd] = await db.update(members)
        .set({ active: !member[0].active }).where(eq(members.id, id)).returning();
        revalidatePath('/members')
        return upd;
}
export async function server_updateMember(data: {id: string, name: string, class: IClass, level: number}) {
    const [member] = await db.update(members).set(data).where(eq(members.id, data.id)).returning();
    revalidatePath('/members')
    return member;
}