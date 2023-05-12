import useAddToWishlist from "@/hooks/mutations/useAddToWishlist";
import useRemoveFromWishlist from "@/hooks/mutations/useRemoveFromWishlist";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { prisma } from "@/lib/db";
import useBucket from "@/store/bucket";
import { HeartIcon } from "@heroicons/react/24/outline";
import {
  ActionIcon,
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
import { useState } from "react";

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
  const { data: wishlist } = useWishlist();

  const { mutate: addMutate } = useAddToWishlist();

  const { mutate: deleteMutate } = useRemoveFromWishlist();

  const theme = useMantineColorScheme();

  const bucket = useBucket();

  const [wishlistProductsLoading, setWishlistProductsLoading] = useState<
    number[]
  >([]);

  const buy = (product: Product) => {
    const productInBucket = bucket.bucket.find(
      (el) => product.id === el.product.id
    );

    if (productInBucket) {
      bucket.setAmount(productInBucket.amount + 1, product.id);
    } else bucket.addProduct(product);
  };

  const like = (productId: number) => {
    const hasNot = wishlist.products.some(
      (product: any) => product.id === productId
    );

    if (hasNot) {
      // setWishlistProductsLoading((prev) => [...prev, productId]);
      deleteMutate(productId);
    } else {
      // setWishlistProductsLoading((prev) => [...prev, productId]);
      addMutate(productId);
    }
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
                      <Image src="/goraPink.png" alt="Image" height={160} />
                    </Card.Section>

                    <Text className="text-xl mt-1 font-semibold">
                      {product.name}
                    </Text>
                    <Text className="text-sm m-1 text-slate-500">
                      от {product.developer}
                    </Text>
                    <div className="flex justify-between items-center">
                      <p className="ml-2 truncate text-lg text-blue-500">
                        {product.price}₴
                      </p>

                      <div className="flex space-x-1 items-center">
                        {wishlist &&
                        wishlist.products.some(
                          (product: any) => product.id === product.id
                        ) ? (
                          <ActionIcon
                            loading={wishlistProductsLoading.includes(
                              product.id
                            )}
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              like(product.id);
                            }}
                            className="bg-transparent"
                          >
                            <HeartIcon className="w-7 h-7 text-red-600 fill-red-600 " />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            loading={wishlistProductsLoading.includes(
                              product.id
                            )}
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              like(product.id);
                            }}
                            className="bg-transparent"
                          >
                            <HeartIcon className="w-7 h-7 text-red-600" />
                          </ActionIcon>
                        )}

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
