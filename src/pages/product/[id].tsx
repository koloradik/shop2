import { prisma } from "@/lib/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Carousel } from "@mantine/carousel";
import {
  ActionIcon,
  Button,
  Divider,
  Image,
  Rating,
  Textarea,
  useMantineColorScheme,
} from "@mantine/core";
import useBucket from "@/store/bucket";
import { Product } from "@prisma/client";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useWishlist } from "@/hooks/queries/useWishlist";
import useAddToWishlist from "@/hooks/mutations/useAddToWishlist";
import useRemoveFromWishlist from "@/hooks/mutations/useRemoveFromWishlist";
import { useState } from "react";
import axios from "axios";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(ctx.params?.id),
    },
    include: {
      comments: true,
    },
  });

  return {
    props: {
      product,
    },
  };
}

export default function ProductPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  const theme = useMantineColorScheme();

  const bucket = useBucket();

  const { data: wishlist, isLoading: isWishlistLoading } = useWishlist();

  const { mutate: addMutate, isLoading: isAddLoading } = useAddToWishlist();

  const { mutate: deleteMutate, isLoading: isRemoveLoading } =
    useRemoveFromWishlist();

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
      deleteMutate(productId);
    } else {
      addMutate(productId);
    }
  };

  const publishComment = () => {
    axios.post("/api/comment", {
      text,
      rating,
      productId: props.product?.id,
    });
  };

  return (
    <>
      <div>
        <div className="ml-4 my-3">Id этого товара: {props.product?.id}</div>
        <div className="flex items-center max-w-3xl:">
          <Carousel
            slideSize="70%"
            slideGap="xl"
            controlsOffset="xs"
            controlSize={20}
            loop
            withIndicators
          >
            <Carousel.Slide>
              <Image src="/goraBlack.png" alt="goraBlack" />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/goraGrayLite.png" alt="goraWhite" />
            </Carousel.Slide>
            <Carousel.Slide>
              <Image src="/goraPink.png" alt="goraPink" />
            </Carousel.Slide>
          </Carousel>
        </div>

        <div className="flex m-6 justify-between items-center">
          <div className="text-5xl font-semibold">{props.product?.name}</div>

          <div
            className={`border space-y-4 ${
              theme.colorScheme === "dark" ? `boeder-white` : `boeder-black`
            }`}
          >
            <div
              className={`text-xl flex justify-center items-center ${
                theme.colorScheme === "dark"
                  ? `text-yellow-400`
                  : `text-yellow-600`
              }`}
            >
              {props.product?.price}₴
            </div>
            <div className="flex items-center">
              {wishlist &&
              wishlist.products.some(
                (product: any) => product.id === product.id
              ) ? (
                <ActionIcon
                  loading={isAddLoading || isRemoveLoading || isWishlistLoading}
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.product) like(props.product.id);
                  }}
                  className="bg-transparent w-9 h-9 mx-3"
                >
                  <HeartIcon className="w-10 h-10 text-red-600 fill-red-600 " />
                </ActionIcon>
              ) : (
                <ActionIcon
                  loading={isAddLoading || isRemoveLoading || isWishlistLoading}
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (props.product) like(props.product.id);
                  }}
                  className="bg-transparent w-9 h-9 mx-3"
                >
                  <HeartIcon className="w-10 h-10 text-red-600" />
                </ActionIcon>
              )}
              <Button
                className="w-32 h-12"
                variant={`${
                  theme.colorScheme === "dark" ? `outline` : `filled`
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (props.product) buy(props.product);
                }}
                color={`green`}
                uppercase
              >
                buy
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      <p>Отзывы:</p>
      <div>
        <Rating fractions={2} onChange={(rValue) => setRating(rValue)} />
        <Textarea
          placeholder="Оставьте комментарий!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={publishComment}>Опубликовать комментарий</Button>
      </div>
      <div>
        {props.product?.comments.map((c) => {
          return (
            <div key={c.id}>
              <p>{c.text}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
