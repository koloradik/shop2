import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { User } from "@/hooks/mutations/useUpdateUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(403).json({ message: "not authoriset" });
  }

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
  }

  if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    return res.status(200).json({ user });
  }

  if (req.method === "PATCH") {
    const body = req.body as User;
    console.log(body);

    const user = await prisma.user.update({
      where: { id: body.id },
      data: {
        image: body.image,
        name: body.name,
        role: body.role,
        balance: body.balance,
        rating: body.rating,
      },
    });

    return res.status(200).json({ user });
  }
}
