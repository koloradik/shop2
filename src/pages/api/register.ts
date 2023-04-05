import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);

  const resp = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (resp) {
    return res.status(400).json({
      error: "Пользоваель с таким Email уже существует.",
    });
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });
  return res.status(200).json({
    user: user,
    message: "Аккаунт успешно создан",
  });
}
