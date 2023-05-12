import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(403).json({ message: "not autorizet" });
  }

  if (req.method === "POST") {
    console.log("POASSRRSARSR");

    const productId = Number(req.query.productId);

    if (!productId) {
      return res.status(400).json({ message: "Не верный запрс" });
    }

    const resp = await prisma.wishlist.create({
      data: {
        product: {
          connect: {
            id: productId,
          },
        },
        user: {
          connect: {
            email: session.user.email as string,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ productId: resp.productId, userId: resp.userId });
  }

  if (req.method === "DELETE") {
    console.log("DEL");
    const productId = Number(req.query.productId);

    if (!productId) {
      return res.status(400).json({ message: "Не верный запрс" });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    const resp = await prisma.wishlist.delete({
      where: {
        userId_productId: {
          productId,
          userId: user?.id as string,
        },
      },
    });

    return res
      .status(200)
      .json({ productId: resp.productId, userId: resp.userId });
  }
}
