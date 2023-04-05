import useAuth from "@/store/auth";
import {
  ActionIcon,
  Avatar,
  Button,
  Drawer,
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

const Info = () => {
  const auth = useAuth();

  const router = useRouter();

  const [drOpen, setDrOpen] = useState(false);

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

  return (
    <div className="flex">
      <div className="relative m-3 group">
        <Avatar className="w-36 h-36 group-hover:opacity-25" />
        <div className="absolute bottom-0 group-hover:flex justify-around w-full hidden mb-1">
          <ActionIcon color="blue" onClick={() => inputRef.current?.click()}>
            <PencilSquareIcon className="w-6 h-6" />
          </ActionIcon>
          <ActionIcon color="red">
            <TrashIcon className="h-6 w-6" />
          </ActionIcon>
        </div>
        <input accept="image/*" ref={inputRef} type="file" className="hidden" />
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
