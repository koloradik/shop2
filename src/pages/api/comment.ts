import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(403).json({ message: "Not Authorized" });
  }

  if (req.method === "POST") {
    const body = req.body as {
      productId: number | undefined;
      rating: number | undefined;
      text: string | undefined;
    };

    if (!body.productId || !body.text || !body.rating) {
      return res.status(400).json({ message: "Wrong data." });
    }

    const comment = await prisma.comment.create({
      data: {
        text: body.text,
        rating: body.rating,
        user: {
          connect: {
            email: session.user.email as string,
          },
        },
        product: {
          connect: {
            id: body.productId,
          },
        },
      },
    });

    return res.status(200).json({ comment });
  }
}
