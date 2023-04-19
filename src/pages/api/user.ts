import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "net usera",
      });
    }

    const user = await prisma.user.delete({
      where: {
        id: userId as string,
      },
    });

    return res.status(200).json({ user: user });
  } else if (req.method === "PATCH") {
    const body = req.body;

    if (!body.userId || !body.avatar || typeof body.avatar !== "string") {
      return res.status(400).json({ message: "nepravilnie dannue" });
    }

    const user = await prisma.user.update({
      where: { id: body.userId },
      data: {
        avatar: body.avatar,
      },
    });

    return res.status(200).json({ user });
  }
}
