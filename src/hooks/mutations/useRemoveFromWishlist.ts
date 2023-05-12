import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteProductFromWishlist = async (productId: number) => {
  return await axios.delete(`/api/like?productId=${productId}`);
};

const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductFromWishlist,
    onSuccess: (_, productId) => {
      queryClient.refetchQueries(["wishlist"]);

      //   setWishlistProductsLoading((prev) =>
      //     prev.filter((id) => id !== productId)
      //   );
    },
  });
};

export default useRemoveFromWishlist;
