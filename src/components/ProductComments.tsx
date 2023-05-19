import useMarkedComments from "@/hooks/queries/useMarkedComments";
import { CommentGetResponse, CommentWithMarks } from "@/pages/api/comment";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  Avatar,
  Button,
  Modal,
  Rating,
  Textarea,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

type ProductCommentsProps = {
  productId: number;
};

const ProductCommmnts = ({ productId }: ProductCommentsProps) => {
  const theme = useMantineColorScheme();
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState<CommentWithMarks[]>([]);

  const [opened, { open, close }] = useDisclosure(false);

  const queryClient = useQueryClient();

  const { data } = useMarkedComments();
  const markedComments = data ? data.marks : [];

  useEffect(() => {
    axios
      .get<CommentGetResponse>(`/api/comment?productId=${productId}`)
      .then((res) => setComments(res.data.comments));
  }, [productId]);

  const publishComment = () => {
    axios.post("/api/comment", {
      text,
      rating,
      productId,
    });
    close();
  };

  const likeComment = (commentId: string) => {
    const isDisliked = markedComments.some((mc) => {
      return mc.mark === false && mc.commentId === commentId;
    });

    if (isDisliked) {
      axios
        .patch("/api/comment/mark", {
          commentId,
          mark: false,
        })
        .then(() => queryClient.refetchQueries(["markedComments"]));
    } else {
      axios
        .post("/api/comment/mark", {
          commentId,
          mark: true,
        })
        .then(() => queryClient.refetchQueries(["markedComments"]));
    }
  };

  const dislikeComment = (commentId: string) => {
    const isLiked = markedComments.some((mc) => {
      return mc.mark === true && mc.commentId === commentId;
    });

    if (isLiked) {
      axios
        .patch("/api/comment/mark", {
          commentId,
          mark: true,
        })
        .then(() => queryClient.refetchQueries(["markedComments"]));
    } else {
      axios
        .post("/api/comment/mark", {
          commentId,
          mark: false,
        })
        .then(() => queryClient.refetchQueries(["markedComments"]));
    }
  };
  const deleteMark = (commentId: string) => {
    axios
      .delete(`/api/comment/mark?commentId=${commentId}`)
      .then(() => queryClient.refetchQueries(["markedComments"]));
  };

  return (
    <>
      <p>Отзывы:</p>
      <Button onClick={open}>Добавить Отзыв</Button>
      <Modal
        size="lg"
        opened={opened}
        onClose={close}
        title="Оформление отзыва:"
      >
        <div className="space-y-3">
          <div className="flex justify-center w-full h-full">
            <Rating
              fractions={2}
              onChange={(rValue) => setRating(rValue)}
              size="xl"
            />
          </div>
          <Textarea
            className=""
            placeholder="Оставьте комментарий!"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autosize
            minRows={2}
            maxRows={4}
          />
          <div className="w-full h-full flex justify-center">
            <Button onClick={publishComment}>Опубликовать комментарий</Button>
          </div>
        </div>
      </Modal>

      <div>
        {comments.map((c) => {
          return (
            <div
              key={c.id}
              className={`m-5 rounded-xl`}
              style={{
                border:
                  theme.colorScheme === "dark"
                    ? "1px solid white"
                    : "1px solid black",
                color: theme.colorScheme === "dark" ? "white" : "black",
              }}
            >
              <span className="flex items-center space-x-3">
                <Avatar
                  src={c.user.image}
                  alt="userAvatar"
                  size="md"
                  radius="xl"
                  className="ml-2"
                />
                <p className="text-lg">{c.user.name}</p>
              </span>
              <Rating
                size="md"
                value={c.rating}
                fractions={2}
                readOnly
                className="ml-3"
              ></Rating>
              <p
                className={`mx-4 text-lg p-3 rounded-lg ${
                  theme.colorScheme === "dark" ? `bg-[#2C2E33]` : `bg-slate-200`
                }`}
              >
                {c.text}
              </p>
              <div className="flex ml-3 mb-3 items-center space-x-3">
                {markedComments.some((mc) => {
                  return mc.mark === true && mc.commentId === c.id;
                }) ? (
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    className="w-10 h-10"
                    onClick={() => deleteMark(c.id)}
                  >
                    <HandThumbUpIcon className="text-blue-700 fill-blue-500 w-8 h-8" />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    className="w-6 h-6"
                    onClick={() => likeComment(c.id)}
                  >
                    <HandThumbUpIcon className="text-blue-500 w-6 h-6" />
                  </ActionIcon>
                )}
                {markedComments.some((mc) => {
                  return mc.mark === false && mc.commentId === c.id;
                }) ? (
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    className="w-10 h-10"
                    onClick={() => deleteMark(c.id)}
                  >
                    <HandThumbDownIcon className="text-red-700 fill-red-500 w-8 h-8" />
                  </ActionIcon>
                ) : (
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    className="w-6 h-6"
                    onClick={() => dislikeComment(c.id)}
                  >
                    <HandThumbDownIcon className="text-red-500 w-6 h-6" />
                  </ActionIcon>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductCommmnts;
