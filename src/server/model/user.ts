import {
  type InsertUser,
  type PublicUser,
  type SelectUser,
  user,
} from "~/server/db/schema";
import type { z } from "zod";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { hashPassword, comparePasswords } from "~/utility/utylity";
import type { Result } from "~/utility/types";

export type SelectUserType = z.infer<typeof SelectUser>;
export type PublicUserType = z.infer<typeof PublicUser>;
export type InsertUserType = z.infer<typeof InsertUser>;

export async function createNewUser(newUser: InsertUserType): Promise<string> {
  if (await doesEmailExists(newUser.email)) {
    throw new Error("Email already exists");
  }

  const { hashedPassword, salt } = hashPassword(newUser.password, 64);
  const userId = (
    await db
      .insert(user)
      .values({
        firstName: newUser.firstName,
        middleName: newUser.middleName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: `${hashedPassword}|${salt}`,
        sex: newUser.sex,
        dob: newUser.dob,
      })
      .returning({ id: user.id })
  )[0];

  if (!userId) {
    throw new Error("Failed to create user");
  }

  return userId.id;
}

async function doesEmailExists(userEmail: string): Promise<boolean> {
  const usr = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.email, userEmail));
  return usr.length > 0 ? true : false;
}

export async function getAllUsers(): Promise<SelectUserType[]> {
  const users = await db.select().from(user);
  return users;
}

export async function getUserByEmail(
  userEmail: string,
): Promise<Result<PublicUserType>> {
  const usr = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      sex: user.sex,
      dob: user.dob,
    })
    .from(user)
    .where(eq(user.email, userEmail));

  if (usr.length < 1) {
    return {
      ok: false,
      error: new Error("User not found"),
    };
  }

  return {
    ok: true,
    value: usr[0]!,
  };
}

export async function getUserByUserId(
  userId: string,
): Promise<Result<PublicUserType>> {
  const usr = await db
    .select({
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      sex: user.sex,
      dob: user.dob,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (usr.length < 1) {
    return {
      ok: false,
      error: new Error("User not found"),
    };
  }

  return {
    ok: true,
    value: usr[0]!,
  };
}

export async function validateUserByEmail(
  userEmail: string,
  password: string,
): Promise<Result<string>> {
  const usr = await db
    .select({
      id: user.id,
      email: user.email,
      password: user.password,
    })
    .from(user)
    .where(eq(user.email, userEmail));

  if (usr.length < 1) {
    return {
      ok: false,
      error: new Error("User not found"),
    };
  }

  const passwordWithSalt = usr[0]!.password.split("|");

  const [hashedPassword, salt] = [passwordWithSalt[0]!, passwordWithSalt[1]!];

  if (comparePasswords(password, salt, hashedPassword)) {
    return {
      ok: true,
      value: usr[0]!.id,
    };
  }

  return {
    ok: false,
    error: new Error("Invalid password"),
  };
}
