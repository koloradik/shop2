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
      className={`flex w-full py-3 border-black sticky top-0 z-50 space-x-2 rounded-lg ${
        theme.colorScheme === "dark" ? `bg-[#2C2E33]` : `bg-slate-200`
      }`}
    >
      <Link
        href={"/"}
        className={`w-1/6 text-2xl font-semibold text-center self-center no-underline sm:w-1/6 hidden sm:block ${
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
        className="w-1/2 sm:w-4/6"
        placeholder="Поиск"
        icon={<MagnifyingGlassIcon className="h-5 w-5" />}
      />

      <div className="flex justify-around items-center w-1/2 sm:w-1/6">
        <Balance />

        <div className="flex space-x-3 ">
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

      <Modal
        size={"auto"}
        opened={showOformZakaz}
        onClose={() => {
          setShowOformZakaz(false);
        }}
        centered
        title="Оформлени заказа:"
      >
        <div className="flex justify-between items-center py-24 flex-wrap gap-10">
          <div className="space-y-3 ml-4">
            <Input.Wrapper withAsterisk label="Имя:">
              <Input className="w-64" id="input-demo" />
            </Input.Wrapper>
            <Input.Wrapper withAsterisk label="Фамилия:">
              <Input className="w-64" id="input-demo" />
            </Input.Wrapper>
          </div>
          <div
            className="mr-4 w-72 h-64 rounded-xl space-y-4"
            style={{
              border:
                theme.colorScheme === "dark"
                  ? `1px solid white`
                  : `1px solid black`,
            }}
          >
            <div className="flex justify-around text-lg">
              <p>Товары:</p>
              <p className="text-blue-600">{totalA}₴</p>
            </div>

            <div className="flex justify-around text-lg">
              <p>Комисия:</p>
              <p className="text-orange-500">3%</p>
            </div>

            <div>
              <Accordion
                variant="contained"
                radius="md"
                defaultValue="customization"
                className="mx-9"
              >
                <Accordion.Item value="customization">
                  <Accordion.Control>Скидка: </Accordion.Control>
                  <Accordion.Panel>
                    {bucket.bucket.map((el) => {
                      return (
                        <div key={el.product.id}>
                          <div className="flex justify-between">
                            <p>{el.product.name}</p>
                            <p
                              className={`${
                                el.product.discount > 0
                                  ? `text-green-500`
                                  : `text-neutral-400`
                              }`}
                            >
                              {el.product.discount * 100}%
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
