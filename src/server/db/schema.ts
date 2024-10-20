// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  varchar,
  uuid,
  customType,
  date,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `wiki_${name}`);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bytea = customType<{ data: string; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
  toDriver(val) {
    let newVal = val;
    if (val.startsWith("0x")) {
      newVal = val.slice(2);
    }

    return Buffer.from(newVal, "hex");
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fromDriver(val: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return val.toString("hex");
  },
});

export const user = createTable("user", 
  {
    id: uuid("user_id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", {length: 35}).notNull(),
    middleName: varchar("middle_name", { length: 35}),
    lastName: varchar("last_name", { length: 35 }),
    email: varchar("email", { length: 255 }).unique().notNull(),
    password: varchar("password", {length: 255}).notNull(),
    sex: varchar("sex", { length: 7 }),
    dob: date("dob"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const SelectUser = createSelectSchema(user);
export const PublicUser = createInsertSchema(user).omit({createdAt: true, updatedAt: true, password: true});
export const InsertUser = createInsertSchema(user).omit({id: true, createdAt: true, updatedAt: true});

export const pageStatus = createTable("page_status",
  {
    id: integer("id").primaryKey(),
    desc: varchar("desc", { length: 256 }).unique(),
  }
);

export const pages = createTable("pages", 
  {
    id: uuid("page_id").defaultRandom().primaryKey(),
    author_id: uuid("author_id").notNull().references(() => user.id),
    title: varchar("title", { length: 255 }).unique(),
    status: integer("status").notNull().references(() => pageStatus.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const multiMedia = createTable("multi_media",
  {
    id: uuid("media_id").defaultRandom().primaryKey(),
    page_id: uuid("page_id").notNull().references(() => pages.id),
    url: varchar("url", { length: 255 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  }
);

export const page_ranking = createTable("page_ranking",
  {
    page_id: uuid("page_id").unique().notNull().references(() => pages.id),
    upVotes: integer("up_votes").$default(() => 0),
    downVotes: integer("down_votes").$default(() => 0),
  }
);

export const pageVoting = createTable("page_voting", 
  {
    user_id: uuid("user_id").unique().notNull().references(() => user.id),
    page_id: uuid("page_id").unique().notNull().references(() => pages.id),
    vote: integer("vote").unique().$default(() => 0),
  },
  (table) => {
      return {
      pk: primaryKey({columns: [table.page_id, table.user_id]})
    }
  }
);
