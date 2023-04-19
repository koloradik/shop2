import { prisma } from "@/lib/db";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Carousel } from "@mantine/carousel";
import { Button, Image, Text, useMantineColorScheme } from "@mantine/core";

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
  const theme = useMantineColorScheme();
  return (
    <>
      <div>
        <div className="ml-4 my-3">Id этого товара: {props.product?.id}</div>
        <Carousel
          slideSize="70%"
          height={300}
          slideGap="xl"
          controlsOffset="xs"
          controlSize={20}
          loop
          withIndicators
        >
          <Carousel.Slide>
            <Image src="/goraBlack.png" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image src="/goraWhite.png" />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image src="/goraPink.png" />
          </Carousel.Slide>
        </Carousel>

        <div className="flex m-6 justify-between items-center">
          <div className="text-5xl font-semibold">{props.product?.model}</div>

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
            <Button
              className="w-32 h-12"
              variant={`${theme.colorScheme === "dark" ? `outline` : `filled`}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                buy(props.product);
              }}
              color={`green`}
              uppercase
            >
              buy
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
