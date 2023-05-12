import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return res.status(400).json({
      user: null,
      message: "Ашібка авторизации",
    });
  } else {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: user.id,
      },
    });

    console.log(wishlist);

    return res.status(200).json({
      user: {
        ...user,
        wishlist: wishlist.map((el) => el.productId),
      },
      message: "Авторизация прошла успешно!",
    });
  }
}
