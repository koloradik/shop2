import { prisma } from "@/lib/db";
import useBucket from "@/store/bucket";
import {
  Alert,
  Button,
  Card,
  Image,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { Product } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

export async function getServerSideProps() {
  const products = await prisma.product.findMany();

  return {
    props: {
      products,
    },
  };
}

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const theme = useMantineColorScheme();

  const bucket = useBucket();

  const buy = (product: Product) => {
    const productInBucket = bucket.bucket.find(
      (el) => product.id === el.product.id
    );

    if (productInBucket) {
      bucket.setAmount(productInBucket.amount + 1, product.id);
    } else bucket.addProduct(product);
  };

  return (
    <>
      <Head>
        <title>Gora</title>
      </Head>

      <div>
        {props.products.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-10 py-10">
            {props.products.map((product) => {
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="no-underline"
                >
                  <Card
                    withBorder
                    className={`h-72 w-72 rounded-lg ${
                      theme.colorScheme === "dark"
                        ? `bg-[#2C2E33]`
                        : `bg-slate-200`
                    }`}
                  >
                    <Card.Section>
                      <Image src="/p.png" alt="Image" height={160} />
                    </Card.Section>

                    <Text className="text-xl mt-1 font-semibold">
                      {product.model}
                    </Text>
                    <Text className="text-sm m-1 text-slate-500">
                      от {product.manufacturer}
                    </Text>
                    <div className="flex justify-between items-center">
                      <p className="ml-2 truncate text-lg text-blue-500">
                        {product.price}₴
                      </p>
                      <Button
                        variant={`${
                          theme.colorScheme === "dark" ? `outline` : `filled`
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          buy(product);
                        }}
                        color={`green`}
                        uppercase
                      >
                        buy
                      </Button>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Alert>Ваш список продуктов пуст.</Alert>
        )}
      </div>
    </>
  );
}
