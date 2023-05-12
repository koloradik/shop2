import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const addProductToWishlist = async (productId: number) => {
  return await axios.post(`/api/like?productId=${productId}`);
};

const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductToWishlist,
    onSuccess: (_, productId) => {
      queryClient.refetchQueries(["wishlist"]);

      //   setWishlistProductsLoading((prev) =>
      //     prev.filter((id) => id !== productId)
      //   );
    },
  });
};

export default useAddToWishlist;
