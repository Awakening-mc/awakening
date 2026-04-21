import { pgTable, text, timestamp, uuid, smallint, integer, pgEnum, boolean } from "drizzle-orm/pg-core";

export const classEnum = pgEnum("class", ["DK", "Necro", "Lock", "Charmer", "Ceifa", "BRB", "Xamã", "Rogue", "CCQ", "Hunter"]);
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").unique().notNull(),
    class: classEnum("class").notNull(),
    level: smallint("level").notNull(),
    active: boolean("active").default(true).notNull(),
})

export const events = pgTable("events", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    date: timestamp("date").notNull(),
})

export const event_attendance = pgTable("event_attendance", {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id").references(() => events.id, {onDelete: "cascade"}).notNull(),
    memberId: uuid("member_id").references(() => members.id, {onDelete: "cascade"}).notNull(),
    attended: boolean("attended").notNull(),
    justified: boolean("justified"),
})

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventAttendance = typeof event_attendance.$inferSelect;
export type NewEventAttendance = typeof event_attendance.$inferInsert;