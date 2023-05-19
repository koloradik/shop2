import {
  Accordion,
  ActionIcon,
  Alert,
  Button,
  Divider,
  Drawer,
  Input,
  Modal,
  NumberInput,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ShoppingCartIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useDisclosure } from "@mantine/hooks";
import useBucket from "@/store/bucket";
import { useSession } from "next-auth/react";
import Balance from "./modals/Balance";
import OformZakaz from "./modals/OformZakaz";

const Header = () => {
  const [showOformZakaz, setShowOformZakaz] = useState(false);

  const session = useSession();

  const theme = useMantineColorScheme();

  const [open, setOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);

  const [openedB, { open: openB, close: closeB }] = useDisclosure(false);

  const bucket = useBucket();

  let totalA = 0;

  for (const el of bucket.bucket) {
    totalA = totalA + el.product.price * el.amount;
  }

  return (
    <div
      className={`flex py-3 border-black sticky top-0 z-50 space-x-2 rounded-lg justify-around items-center ${
        theme.colorScheme === "dark" ? `bg-[#2C2E33]` : `bg-slate-200`
      }`}
    >
      <Link
        href={"/"}
        className={`w-1/6 text-2xl font-semibold text-center self-center no-underline hidden sm:block shrink-0 ${
          theme.colorScheme === "dark" ? `text-white` : `text-black`
        }`}
      >
        <Text
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 from-20% to-orange-500 to-80%"
        >
          G o r a
        </Text>
      </Link>

      <TextInput
        className="w-full"
        placeholder="Поиск"
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
      />

      <div className="flex justify-center items-center space-x-5 w-2/6 shrink-0">
        <Balance />

        {theme.colorScheme === "dark" ? (
          <ActionIcon
            onClick={() => theme.toggleColorScheme()}
            variant="transparent"
            style={{
              border: "1px solid white",
            }}
          >
            <SunIcon className="w-7 h-7 text-white" />
          </ActionIcon>
        ) : (
          <ActionIcon
            onClick={() => theme.toggleColorScheme()}
            variant="transparent"
            style={{
              border: "1px solid black",
            }}
          >
            <MoonIcon className="w-7 h-7 text-black" />
          </ActionIcon>
        )}

        {session.status === "authenticated" ? (
          <Link href="/profile">
            <ActionIcon
              variant="transparent"
              style={{
                border:
                  theme.colorScheme === "dark"
                    ? "1px solid white"
                    : "1px solid black",
              }}
            >
              <UserIcon
                className="w-7 h-7"
                style={{
                  color: theme.colorScheme === "dark" ? "white" : "black",
                }}
              />
            </ActionIcon>
          </Link>
        ) : (
          <ActionIcon
            variant="transparent"
            style={{
              border:
                theme.colorScheme === "dark"
                  ? "1px solid white"
                  : "1px solid black",
            }}
            onClick={() => setOpen(true)}
          >
            <ArrowLeftOnRectangleIcon
              className="w-7 h-7"
              style={{
                color: theme.colorScheme === "dark" ? "white" : "black",
              }}
            />
          </ActionIcon>
        )}

        <ActionIcon
          variant="transparent"
          style={{
            border:
              theme.colorScheme === "dark"
                ? "1px solid white"
                : "1px solid black",
          }}
          onClick={openB}
        >
          <ShoppingCartIcon
            className="w-7 h-7"
            style={{
              color: theme.colorScheme === "dark" ? "white" : "black",
            }}
          />
        </ActionIcon>
      </div>

      <Modal
        opened={open}
        onClose={() => {
          setOpen(false);
        }}
        title="Авторизация"
      >
        {regOpen ? (
          <Register closeModal={() => setOpen(false)} />
        ) : (
          <Login closeModal={() => setOpen(false)} />
        )}
        {regOpen ? (
          <div className="flex justify-end">
            <Button
              variant="subtle"
              onClick={() => {
                setRegOpen(false);
              }}
            >
              Уже есть аккаунт?
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              variant="subtle"
              className="normal-case"
              onClick={() => {
                setRegOpen(true);
              }}
            >
              Нет аккаунта?
            </Button>
          </div>
        )}
      </Modal>

      <Drawer
        opened={openedB}
        onClose={closeB}
        title="Корзина"
        position="bottom"
      >
        {bucket.bucket.length > 0 ? (
          <>
            <div className="flex font-semibold">
              <Text className="w-1/4 text-center">Игра</Text>
              <Text className="w-1/4 text-center">Стоимость</Text>
              <Text className="w-1/4 text-center">Количество</Text>
            </div>
            {bucket.bucket.map((el) => {
              return (
                <>
                  <Divider my="xs" />
                  <div key={el.product.id} className="flex items-center w-full">
                    <Text className="w-1/4 text-center">{el.product.name}</Text>
                    <Text className="w-1/4 text-center">
                      {el.product.price * el.amount}₴
                    </Text>
                    <NumberInput
                      className="w-1/4 text-center"
                      min={1}
                      value={el.amount}
                      onChange={(e) => {
                        if (e) {
                          bucket.setAmount(e, el.product.id);
                        }
                      }}
                    />
                    <div className="w-1/4 flex justify-center">
                      <ActionIcon
                        color="red"
                        variant="outline"
                        onClick={() => bucket.removeProduct(el.product.id)}
                      >
                        <TrashIcon className="h-6 w-6" />
                      </ActionIcon>
                    </div>
                  </div>
                  <Divider my="xs" />
                </>
              );
            })}
            <div className="flex justify-between items-center">
              <Text
                variant="gradient"
                gradient={{ from: "#15aabf", to: "#5f3dc4", deg: -0.3 }}
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                fz="xl"
                fw={700}
              >
                Итого: {totalA}₴
              </Text>
              <Button
                variant="gradient"
                gradient={{ from: "#15aabf", to: "#5f3dc4", deg: -0.3 }}
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                fz="xl"
                fw={700}
                onClick={() => {
                  setShowOformZakaz(true);
                  closeB();
                }}
              >
                Оформить заказ
              </Button>
            </div>
          </>
        ) : (
          <Alert variant="light" icon={<InformationCircleIcon />}>
            Ваша корзина пуста ;(
          </Alert>
        )}
      </Drawer>
      <OformZakaz />
    </div>
  );
};

export default Header;
