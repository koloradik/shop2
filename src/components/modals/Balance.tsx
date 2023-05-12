import useUpdateUser from "@/hooks/mutations/useUpdateUser";
import useUser from "@/hooks/queries/useUser";
import {
  Accordion,
  Button,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const Balance = () => {
  const [sum, setSum] = useState(0);

  const popoln250 = () => {
    setSum((prev) => (prev += 250));
  };
  const popoln500 = () => {
    setSum((prev) => (prev += 500));
  };
  const popoln1000 = () => {
    setSum((prev) => (prev += 1000));
  };

  const resetPopoln = () => {
    setValue("");
    setSum(0);
  };

  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const { data: user } = useUser();
  const { mutate, isLoading } = useUpdateUser();

  const theme = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  const handleTopup = () => {
    if (!value) {
      setError("Неверные данные");
    } else if (user) {
      setError("");
      mutate({
        id: user.user.id,
        name: user.user.name,
        role: user.user.role,
        rating: user.user.rating,
        balance: user.user.balance + Number(value),
        email: user.user.email,
        image: user.user.iamge,
      });
    }
  };

  const handleModal = () => {
    open();
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number.isNaN(Number(e.target.value))) {
      setError("Неверное значение");
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <>
      <div
        className="rounded hidden sm:flex sm:w-20 sm:items-center "
        style={{
          border:
            theme.colorScheme === "dark"
              ? "1px solid white"
              : "1px solid black",
          color: theme.colorScheme === "dark" ? "white" : "black",
        }}
      >
        <div className="ml-1 w-2/3">{user?.user.balance}</div>
        <button
          className="border-none bg-green-600 hover:bg-orange-400 mr-1 my-1 w-6 rounded-md"
          onClick={handleModal}
        >
          +
        </button>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title="Пополнение баланса"
        size="xl"
      >
        <LoadingOverlay visible={isLoading} overlayBlur={3} />
        <div className="h-96">
          <Accordion variant="default" radius="md" defaultValue="customization">
            <Accordion.Item value="customization">
              <Accordion.Control>Частые пополнение</Accordion.Control>
              <Accordion.Panel>
                <div className="flex justify-center space-x-10">
                  <Button
                    variant="outline"
                    className="rounded-2xl w-20 h-10 text-lg"
                    onClick={popoln250}
                  >
                    250
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl w-20 h-10 text-lg"
                    onClick={popoln500}
                  >
                    500
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl w-20 h-10 text-lg"
                    onClick={popoln1000}
                  >
                    1000
                  </Button>
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="flexibility">
              <Accordion.Control>Ввести свою сумму</Accordion.Control>
              <Accordion.Panel>
                <div className="flex space-x-2 items-end">
                  <TextInput
                    placeholder="₴"
                    label="Сумма"
                    radius="md"
                    size="md"
                    withAsterisk
                    value={value}
                    onChange={handleBalanceChange}
                  />
                </div>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <div className="flex justify-between items-center mt-5">
            <div className="flex space-x-5 items-center">
              <Text
                variant="gradient"
                gradient={{ from: "#15aabf", to: "#5f3dc4", deg: -0.3 }}
                sx={{ fontFamily: "Greycliff CF, sans-serif" }}
                fz="xl"
                fw={700}
              >
                Сумма пополнение: {Number(value) + sum}₴
              </Text>
              <Button onClick={resetPopoln}>Сброс</Button>
            </div>
            <Button disabled={Number(value) + sum === 0} onClick={handleTopup}>
              Пополнить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Balance;
