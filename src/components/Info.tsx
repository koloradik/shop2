import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Drawer,
  LoadingOverlay,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useRef, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  TrashIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import axios from "axios";
import { UploadApiResponse } from "cloudinary";
import { signOut, useSession } from "next-auth/react";
import useUser from "@/hooks/queries/useUser";
import { useQueryClient } from "@tanstack/react-query";

const Info = () => {
  const session = useSession();

  const router = useRouter();

  const [changeNameStatus, setChangeNameStatus] = useState(false);

  const [name, setName] = useState("");

  const { data: user } = useUser();

  const [drOpen, setDrOpen] = useState(false);
  const [isAvUpload, setAvUpload] = useState(false);

  const onDrClose = () => {
    setDrOpen(false);
  };

  const theme = useMantineColorScheme();

  const queryClient = useQueryClient();

  const logout = () => {
    signOut();
    setDrOpen(false);
    router.push("/");
  };

  const deleteAcc = () => {
    fetch(`/api/user`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => logout());
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvUpload(true);
      const signData = (
        await axios.post("/api/authorize_upload", {
          folder: "avatars",
        })
      ).data;

      const url = `https://api.cloudinary.com/v1_1/${signData.cloud_name}/auto/upload`;

      const formData = new FormData();

      formData.append("file", e.target.files[0]);
      formData.append("api_key", signData.api_key);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", "avatars");

      const cloudinaryData = (
        await axios.post<UploadApiResponse>(url, formData)
      ).data;

      axios
        .patch("/api/user", {
          image: cloudinaryData.secure_url,
          name: user.user.name,
          role: user.user.role,
          balance: user.user.balance,
          rating: user.user.rating,
          id: user.user.id,
        })
        .then((res) => {
          setAvUpload(false);
          queryClient.refetchQueries(["user"]);
        });
    }
  };

  const deleteAv = () => {
    setAvUpload(true);
    axios
      .patch("/api/user", {
        image: "",
        name: user.user.name,
        role: user.user.role,
        balance: user.user.balance,
        rating: user.user.rating,
        id: user.user.id,
      })
      .then((res) => {
        setAvUpload(false);
        queryClient.refetchQueries(["user"]);
      });
  };

  const changeName = () => {
    axios
      .patch("/api/user", {
        image: user.user.image,
        name: name,
        role: user.user.role,
        balance: user.user.balance,
        rating: user.user.rating,
        id: user.user.id,
      })
      .then((res) => {
        setAvUpload(false);
        queryClient.refetchQueries(["user"]);
      });
  };

  const showChangNameInput = () => {
    setChangeNameStatus(true);
  };

  return (
    <div className="space-y-5 flex justify-center flex-col items-center mb-96">
      <div className="w-72 h-72 relative m-3 group">
        <LoadingOverlay visible={isAvUpload} overlayBlur={3} />
        <Avatar
          src={user?.user?.image}
          className="w-72 h-72 group-hover:opacity-25 rounded-3xl"
        />
        <div className="absolute w-72 h-72 bottom-0 group-hover:flex justify-around items-end hidden mb-1">
          <ActionIcon color="blue" onClick={() => inputRef.current?.click()}>
            <PencilSquareIcon className="w-8 h-8" />
          </ActionIcon>
          <ActionIcon color="red" onClick={deleteAv}>
            <TrashIcon className="h-8 w-8" />
          </ActionIcon>
        </div>
        <input
          accept="image/*"
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleImageInput}
        />
      </div>
      <div className="flex justify-center w-full">
        <div className="text-2xl">
          <p>Email: {user?.user?.email}</p>
          <p className="flex">
            Имя:
            {changeNameStatus === false ? (
              <div className="ml-2">{user?.user?.name}</div>
            ) : (
              <div className="flex items-center space-x-1 ml-1">
                <TextInput
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  data-autofocus
                  autoFocus
                ></TextInput>
                <ActionIcon
                  variant="outline"
                  className="h-8 w-8"
                  color="blue"
                  onClick={() => {
                    changeName(), setChangeNameStatus(false);
                  }}
                >
                  <CheckIcon className="h-8 w-8" color="sky" />
                </ActionIcon>
              </div>
            )}
          </p>
          <p>Ваш статус: {user?.user?.role}</p>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <Button
          className="text-blue mr-3 "
          variant="outline"
          onClick={() => setDrOpen(true)}
        >
          <Cog6ToothIcon className="w-6 h-6" />
          <p className="text-xl ml-2 flex">Настройки пользователя</p>
        </Button>
      </div>

      <Drawer opened={drOpen} onClose={onDrClose} title="Настройки">
        <div className={`space-y-3`}>
          <Button
            variant={`${theme.colorScheme === "dark" ? `outline` : `light`}`}
            className="w-96"
            color={"cyan"}
            onClick={() => {
              showChangNameInput(), onDrClose();
            }}
          >
            <PencilSquareIcon className="w-5 h-5" />
            <p className="ml-1">Изменить никнейм</p>
          </Button>
          <Divider my="xs" />
          <Button
            variant={`${theme.colorScheme === "dark" ? `outline` : `light`}`}
            className="w-96"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />{" "}
            <p className="ml-1">Выйти</p>
          </Button>
          <Button
            color={"red"}
            variant={`${theme.colorScheme === "dark" ? `outline` : `light`}`}
            className="w-96"
            onClick={deleteAcc}
          >
            <TrashIcon className="w-5 h-5" />{" "}
            <p className="ml-1">Удалить аккаунт</p>
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Info;
