'use server'
import * as bcrypt from 'bcryptjs'
import {db} from "@/db";
import {eq} from "drizzle-orm";
import {users} from "@/db/schema";
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export async function server_login({name, password}: {name: string, password: string}) {
    const [user] = await db.select().from(users).where(eq(users.name, name));
    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: (60*60*24*30) });
    (await cookies()).set('awakening-app-token', token, { httpOnly: true, path: '/' });
    return token;

}
export async function server_validateToken(token: string) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
        if (!user) {
            throw new Error("User not found");
        }
        return true;
    } catch (err) {
        return false;
    }
}