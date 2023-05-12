import useAddToWishlist from "@/hooks/mutations/useAddToWishlist";
import useRemoveFromWishlist from "@/hooks/mutations/useRemoveFromWishlist";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Image, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const Wishlist = () => {
  const [wishlistProductsLoading, setWishlistProductsLoading] = useState<
    number[]
  >([]);

  const theme = useMantineColorScheme();

  const { data: wishlist, isLoading: isWishlistLoading } = useWishlist();

  const { mutate: addMutate, isLoading: isAddLoading } = useAddToWishlist();

  const { mutate: deleteMutate, isLoading: isRemoveLoading } =
    useRemoveFromWishlist();

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

  return (
    <>
      <div>
        {wishlist &&
          wishlist.products.map((product: any) => {
            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="no-underline"
              >
                <div
                  key={product.id}
                  className={` flex justify-between items-center m-4 rounded-lg`}
                  style={{
                    border:
                      theme.colorScheme === "dark"
                        ? `1px solid white`
                        : `1px solid black`,
                  }}
                >
                  <div className="flex items-center">
                    <Image
                      className="m-1 rounded-lg"
                      height={68}
                      width={96}
                      src={`${
                        theme.colorScheme === "dark"
                          ? `/goraGrayLite.png`
                          : `/goraBlack.png`
                      }`}
                      alt="game"
                    ></Image>
                    <p
                      className={`ml-3 text-xl ${
                        theme.colorScheme === "dark"
                          ? `text-slate-200`
                          : `text-[#2C2E33]`
                      }`}
                    >
                      {product.name}
                    </p>
                    <p className="ml-3 text-lg text-slate-500">
                      от {product.developer}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <p
                      className={`mr-3 text-lg ${
                        theme.colorScheme === "dark"
                          ? `text-green-500`
                          : `text-green-600`
                      }`}
                    >
                      {product.price}₴
                    </p>

                    {wishlist &&
                    wishlist.products.some(
                      (product: any) => product.id === product.id
                    ) ? (
                      <ActionIcon
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          like(product.id);
                        }}
                        className="bg-transparent mr-4"
                      >
                        <HeartIcon className=" text-red-600 fill-red-600 " />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="light"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          like(product.id);
                        }}
                        className="bg-transparent mr-4 "
                      >
                        <HeartIcon className=" text-red-600" />
                      </ActionIcon>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
};

export default Wishlist;
