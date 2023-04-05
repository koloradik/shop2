import { prisma } from "@/lib/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(ctx.params?.id),
    },
  });

  return {
    props: {
      product,
    },
  };
}

export default function Product(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <div>{props.product?.id}</div>;
}
