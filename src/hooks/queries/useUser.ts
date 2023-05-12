import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getUser = async () => {
  return (await axios.get("/api/user")).data;
};

const useUser = () => {
  return useQuery({
    queryFn: getUser,
    queryKey: ["user"],
  });
};

export default useUser;
