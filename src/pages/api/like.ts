import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const productId = req.body.productId;
  const userId = req.body.userId;

  console.log(productId, userId);

  if (!userId || !productId) {
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
          id: userId,
        },
      },
    },
  });

  return res
    .status(200)
    .json({ productId: resp.productId, userId: resp.userId });
}
