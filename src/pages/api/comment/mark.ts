import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { prisma } from "@/lib/db";
import { Comment, CommentMark, User } from "@prisma/client";

export type MarkedCommentsGetResponse = {
  marks: (CommentMark & {
    comment: Comment;
  })[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: "notauthorized" });
  }

  if (req.method === "GET") {
    const marks = await prisma.commentMark.findMany({
      where: {
        user: { email: session.user.email as string },
      },
      include: { comment: true },
    });

    return res.status(200).json({ marks });
  }

  if (req.method === "POST") {
    const body = req.body as {
      commentId: string | undefined;
      mark: boolean | undefined;
    };

    if (!body.commentId || typeof body.mark === "undefined") {
      return res.status(400).json({ message: "no comment id" });
    }

    const mark = await prisma.commentMark.create({
      data: {
        mark: body.mark,
        comment: { connect: { id: body.commentId } },
        user: { connect: { email: session.user.email as string } },
      },
    });

    return res.status(200).json({ mark });
  }

  if (req.method === "PATCH") {
    const body = req.body as {
      commentId: string | undefined;
      mark: boolean | undefined;
    };

    if (!body.commentId || typeof body.mark === "undefined") {
      return res.status(400).json({ message: "no comment id or mark" });
    }

    const user = (await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })) as User;

    const updatedMark = await prisma.commentMark.update({
      data: { mark: !body.mark },
      where: {
        userId_commentId: { commentId: body.commentId, userId: user.id },
      },
    });

    return res.status(200).json({ mark: updatedMark });
  }

  if (req.method === "DELETE") {
    const commentId = req.query.commentId;

    if (!commentId) {
      return res.status(400).json({ message: "no comment id" });
    }

    const user = (await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })) as User;

    const mark = await prisma.commentMark.delete({
      where: {
        userId_commentId: {
          commentId: commentId as string,
          userId: user.id,
        },
      },
    });

    return res.status(200).json({ mark });
  }
}
