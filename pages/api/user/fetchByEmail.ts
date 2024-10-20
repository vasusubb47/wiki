import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { getUserByEmail, type PublicUserType } from "~/server/model/user";
import type { ErrorMsg } from "~/utility/types";
import { isValidBody } from "~/utility/utylity";

export default async function handle(req: NextApiRequest, res: NextApiResponse<PublicUserType | ErrorMsg>) {
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }
    
    if (!isValidBody(req.body, z.object({email: z.string()}))) {
        res.status(400).json({ message: "Invalid request body" });
        return;
    }
    
    const user = await getUserByEmail(req.body.email);

    if (!user.ok) {
        res.status(404).json({message: user.error.message});
        return;
    }

    res.status(200).json(user.value);
}
