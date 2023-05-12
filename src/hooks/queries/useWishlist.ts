import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getWishlist = async () => {
  return (await axios.get("/api/wishlist")).data;
};

export const useWishlist = () => {
  return useQuery({
    queryFn: getWishlist,
    queryKey: ["wishlist"],
  });
};
