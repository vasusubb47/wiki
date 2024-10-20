import type { NextApiRequest, NextApiResponse } from "next";

import { getAllUsers, type SelectUserType } from "~/server/model/user";
import type { ErrorMsg } from "~/utility/types";

export default async function handle(req: NextApiRequest, res: NextApiResponse<SelectUserType[] | ErrorMsg>) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }
    
    const users = await getAllUsers();

    res.status(200).json(users);
}
