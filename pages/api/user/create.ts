import type { NextApiRequest, NextApiResponse } from "next";

import { InsertUser } from "~/server/db/schema";
import { createNewUser, type InsertUserType } from "~/server/model/user";
import { type ErrorMsg, type Result } from "~/utility/types";
import { isValidBody } from "~/utility/utylity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (!isValidBody(req.body, InsertUser)) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  const userId = await createNewUser(req.body);

  res.status(200).json({ userId: userId });
}

export async function createUser(user: InsertUserType): Promise<Result<string, ErrorMsg>> {
  const userId = await createNewUser(user);
  return { ok: true, value: userId };
}
