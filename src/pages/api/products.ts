import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "ne ykazan userId",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        userId: userId as string,
      },
    });

    return res.status(200).json({
      products: products,
    });
  }

  if (req.method === "POST") {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        message: "ne ykazan user Id",
      });
    }

    const body = JSON.parse(req.body);

    const product = await prisma.product.create({
      data: {
        model: body.model,
        manufacturer: body.manuf,
        price: Number(body.price),
        description: body.desc,
        userId: userId as string,
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
        model: body.model,
        manufacturer: body.manuf,
        price: Number(body.price),
        description: body.desc,
      },
    });

    return res.status(200).json({
      product,
    });
  }
}
