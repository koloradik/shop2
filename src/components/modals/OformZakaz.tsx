import useBucket from "@/store/bucket";
import { Accordion, Input, Modal, useMantineColorScheme } from "@mantine/core";
import { useState } from "react";

const OformZakaz = () => {
  const [showOformZakaz, setShowOformZakaz] = useState(false);

  const bucket = useBucket();

  const theme = useMantineColorScheme();

  let totalA = 0;

  for (const el of bucket.bucket) {
    totalA = totalA + el.product.price * el.amount;
  }

  return (
    <>
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
    </>
  );
};

export default OformZakaz;
