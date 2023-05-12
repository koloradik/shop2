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
    return res.status(400).json({
      message: "ne ykazan userId",
    });
  }

  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      where: {
        user: {
          email: session.user.email as string,
        },
      },
    });

    return res.status(200).json({
      products: products,
    });
  }

  if (req.method === "POST") {
    const body = JSON.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: body.name,
        developer: body.developer,
        price: Number(body.price),
        description: body.desc,
        user: { connect: { email: session.user.email as string } },
      },
    });

    return res.status(200).json({
      product: product,
    });
  }

  if (req.method === "DELETE") {
    const productId = req.query.productId;

    if (!productId) {
      return res.status(400).json({
        message: "ne ykazan prodykt Id",
      });
    }

    const product = await prisma.product.delete({
      where: {
        id: Number(productId),
      },
    });

    return res.status(200).json({
      productId: product.id,
    });
  }

  if (req.method === "PATCH") {
    const body = JSON.parse(req.body);

    const product = await prisma.product.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        developer: body.developer,
        price: Number(body.price),
        description: body.desc,
      },
    });

    return res.status(200).json({
      product,
    });
  }
}
