import useAuth from "@/store/auth";
import {
  ActionIcon,
  Avatar,
  Button,
  Drawer,
  LoadingOverlay,
  useMantineColorScheme,
} from "@mantine/core";
import { useRef, useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  TrashIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import axios from "axios";
import { UploadApiResponse } from "cloudinary";

const Info = () => {
  const auth = useAuth();

  const router = useRouter();

  const [drOpen, setDrOpen] = useState(false);
  const [isAvUpload, setAvUpload] = useState(false);

  const onDrClose = () => {
    setDrOpen(false);
  };

  const theme = useMantineColorScheme();

  const logout = () => {
    auth.logout();
    setDrOpen(false);
    router.push("/");
  };

  const deleteAcc = () => {
    fetch(`/api/user?userId=${auth.user?.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        logout();
      });
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
          userId: auth.user?.id,
          avatar: cloudinaryData.secure_url,
        })
        .then((res) => {
          auth.updateAvatar(cloudinaryData.secure_url);
          setAvUpload(false);
        });
    }
  };

  const deleteAv = () => {
    setAvUpload(true);
    axios
      .patch("/api/user", {
        userId: auth.user?.id,
        avatar: "",
      })
      .then((res) => {
        auth.updateAvatar("");
        setAvUpload(false);
      });
  };

  return (
    <div className="flex">
      <div className="relative m-3 group">
        <LoadingOverlay visible={isAvUpload} overlayBlur={3} />
        <Avatar
          src={auth.user?.avatar}
          className="w-36 h-36 group-hover:opacity-25"
        />
        <div className="absolute bottom-0 group-hover:flex justify-around w-full hidden mb-1">
          <ActionIcon color="blue" onClick={() => inputRef.current?.click()}>
            <PencilSquareIcon className="w-6 h-6" />
          </ActionIcon>
          <ActionIcon color="red" onClick={deleteAv}>
            <TrashIcon className="h-6 w-6" />
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
      <div className="flex justify-between w-full">
        <div className="text-2xl">
          <p>Email: {auth.user?.email}</p>
          <p>Имя: {auth.user?.name}</p>
        </div>
        <div>
          <Button
            className="text-blue mr-3"
            variant="moi"
            onClick={() => setDrOpen(true)}
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
      <Drawer opened={drOpen} onClose={onDrClose} title="Настройки">
        <div className={`space-y-3`}>
          <Button
            variant={`${theme.colorScheme === "dark" ? `outline` : `light`}`}
            className="w-96"
            onClick={logout}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Выйти
          </Button>
          <Button
            color={"red"}
            variant={`${theme.colorScheme === "dark" ? `outline` : `light`}`}
            className="w-96"
            onClick={deleteAcc}
          >
            <TrashIcon className="w-5 h-5" /> Удалить аккаунт
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default Info;
