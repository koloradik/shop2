import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  const resp = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!resp) {
    return res.status(200).json({
      user: null,
      message: "Ашібка авторизации",
    });
  } else {
    return res.status(200).json({
      user: resp,
      message: "Авторизация прошла успешно!",
    });
  }
}
