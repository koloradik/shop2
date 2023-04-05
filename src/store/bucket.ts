import { Product } from "@prisma/client";
import { create } from "zustand";

type Bucket = {
  amount: number;
  product: Product;
}[];

type BucketStore = {
  bucket: Bucket;

  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  setAmount: (amount: number, productId: number) => void;
};

const useBucket = create<BucketStore>((set) => ({
  bucket: [],
  addProduct: (product) =>
    set((state) => ({
      bucket: [...state.bucket, { amount: 1, product }],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      bucket: state.bucket.filter((el) => el.product.id !== productId),
    })),
  setAmount: (amount, productId) =>
    set((state) => ({
      bucket: state.bucket.map((el) => {
        if (el.product.id === productId) {
          return {
            ...el,
            amount,
          };
        } else {
          return el;
        }
      }),
    })),
}));

export default useBucket;
