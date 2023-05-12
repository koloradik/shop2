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
    return res.status(400).json({ message: "not autorized" });
  }

  const resp = (
    await prisma.wishlist.findMany({
      where: {
        user: { email: session.user.email as string },
      },
      include: {
        product: true,
      },
    })
  ).map((el) => ({
    ...el.product,
  }));

  return res.status(200).json({ products: resp });
}
