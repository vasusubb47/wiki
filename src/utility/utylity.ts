/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { z } from "zod"
import { MD5, enc} from "crypto-js";

export function isValidBody<T extends z.ZodSchema>(
    body: any,
    schema: T
): body is z.infer<T> {
    const { success } = schema.safeParse(body)
    return success
}

export function genRandString(len: number) {
    const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let result = "";

    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export function saltHash(password: string, salt: string): string {
    const hash = MD5(`${password}${salt}`);
    return hash.toString(enc.Hex)
}

export function comparePasswords(password: string, salt: string, hashedPassword: string): boolean {
    const hashedInput = saltHash(password, salt);
    return hashedInput === hashedPassword;
}

export function hashPassword(password: string, saltLen: number) {
    const salt = genRandString(saltLen);
    const hashedPassword = saltHash(password, salt);
    return {
        hashedPassword,
        salt
    };
}
