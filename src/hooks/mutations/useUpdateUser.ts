import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  balance: number;
  rating: number;
};

const updateUser = async (args: User) => {
  return (await axios.patch("/api/user", { ...args })).data;
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.refetchQueries(["user"]);
    },
  });
};

export default useUpdateUser;
