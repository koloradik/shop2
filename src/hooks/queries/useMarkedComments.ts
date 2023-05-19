import { MarkedCommentsGetResponse } from "@/pages/api/comment/mark";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getMarkedComments = async () => {
  return (await axios.get<MarkedCommentsGetResponse>("/api/comment/mark")).data;
};

const useMarkedComments = () => {
  return useQuery({ queryFn: getMarkedComments, queryKey: ["markedComments"] });
};

export default useMarkedComments;
