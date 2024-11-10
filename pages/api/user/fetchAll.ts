import type { NextApiRequest, NextApiResponse } from "next";

import { getAllUsers, type SelectUserType } from "~/server/model/user";
import type { ErrorMsg, Result } from "~/utility/types";

export default async function handle(req: NextApiRequest, res: NextApiResponse<SelectUserType[] | ErrorMsg>) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }
    
    const users = await getAllUsers();

    res.status(200).json(users);
}

export async function fetchAllUsers(): Promise<Result<SelectUserType[], ErrorMsg>> {
    const users = await getAllUsers();
    if (users.length < 1) {
        return { ok: false, error: { message: "No users found" } };
    }
    return { ok: true, value: users };
}
