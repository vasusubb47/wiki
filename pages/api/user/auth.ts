import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { validateUserByEmail, getUserByUserId } from "~/server/model/user";
import { isValidBody } from "~/utility/utylity";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  if (
    !isValidBody(
      req.body,
      z.object({ email: z.string(), password: z.string() }),
    )
  ) {
    res.status(400).json({ message: "Invalid request body" });
    return;
  }

  const usrId = await validateUserByEmail(req.body.email, req.body.password);

  if (!usrId.ok) {
    res.status(401).json({ message: usrId.error.message });
    return;
  }

  const user = await getUserByUserId(usrId.value);

  if (!user.ok) {
    res.status(404).json({ message: user.error.message });
    return;
  }

  res.status(200).json(user.value);
}
