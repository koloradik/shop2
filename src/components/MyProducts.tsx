import {
  Alert,
  Button,
  Card,
  Image,
  LoadingOverlay,
  Modal,
  Text,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { Product } from "@prisma/client";
import { useEffect, useState } from "react";

const MyProducts = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [id, setId] = useState("");
  const [developer, setDeveloper] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const [isCrLoading, setCrLoading] = useState(false);
  const [isEdLoading, setEdLoading] = useState(false);
  const [deletingPr, setDeletingPr] = useState<number[]>([]);

  const changeDeveloper = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDeveloper(e.target.value);
  };
  const changeModel = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setName(e.target.value);
  };
  const changeDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDesc(e.target.value);
  };
  const changePrice = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPrice(e.target.value);
  };

  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.products);
      });
  }, []);

  const onCreateClose = () => {
    setOpenCreate(false);
  };
  const onEditClose = () => {
    setOpenEdit(false);
  };

  const clear = () => {
    setDeveloper("");
    setName("");
    setDesc("");
    setPrice("");
  };

  const createProduct = () => {
    setCrLoading(true);

    fetch(`/api/products`, {
      method: "POST",
      body: JSON.stringify({
        developer,
        name,
        desc,
        price,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setProducts((prev) => [res.product, ...prev]);
        setOpenCreate(false);
        clear();

        setCrLoading(false);
      });
  };

  const deleteProduct = (productId: number) => {
    setDeletingPr((prev) => [...prev, productId]);

    fetch(`/api/products?productId=${productId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => {
        setProducts((prev) =>
          prev.filter((product) => product.id !== res.productId)
        );
        setDeletingPr((prev) =>
          prev.filter((el) => {
            return el !== productId;
          })
        );
      });
  };

  const editProduct = () => {
    setEdLoading(true);

    fetch(`/api/products`, {
      method: "PATCH",
      body: JSON.stringify({
        developer,
        name,
        desc,
        price,
        id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setProducts((prev) =>
          prev.map((product) => {
            if (product.id === res.product.id) {
              return {
                ...res.product,
              };
            }
            return product;
          })
        );
        setOpenEdit(false);
        setEdLoading(false);
      });
  };

  const theme = useMantineColorScheme();

  return (
    <div>
      <Button
        className="m-4"
        variant="outline"
        onClick={() => setOpenCreate(true)}
      >
        Добавить продукт
      </Button>

      <Modal
        opened={openCreate}
        onClose={onCreateClose}
        title=" Создание нового продукта"
      >
        <LoadingOverlay visible={isCrLoading} overlayBlur={3} />
        <TextInput
          className="mt-2"
          label="Разработчик:"
          value={developer}
          onChange={(e) => changeDeveloper(e)}
          withAsterisk
        />
        <TextInput
          label="Название:"
          value={name}
          onChange={(e) => changeModel(e)}
          withAsterisk
        />
        <TextInput
          label="Описание:"
          value={desc}
          onChange={(e) => changeDesc(e)}
          withAsterisk
        />
        <TextInput
          label="Цена:"
          value={price}
          onChange={(e) => changePrice(e)}
          withAsterisk
        />
        <div className="mt-3 space-x-3 flex justify-end">
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              setOpenCreate(false);
              clear();
            }}
          >
            Отмена
          </Button>
          <Button variant="outline" color="green" onClick={createProduct}>
            Создать
          </Button>
        </div>
      </Modal>

      <Modal
        opened={openEdit}
        onClose={onEditClose}
        title="Редактирование продукта"
      >
        <LoadingOverlay visible={isEdLoading} overlayBlur={3} />
        <TextInput className="mt-2" label="id" value={id} disabled />
        <TextInput
          className="mt-2"
          label="Производитель"
          value={developer}
          onChange={(e) => changeDeveloper(e)}
        />
        <TextInput
          label="Модель"
          value={name}
          onChange={(e) => changeModel(e)}
        />
        <TextInput
          label="Описание"
          value={desc}
          onChange={(e) => changeDesc(e)}
        />
        <TextInput
          label="Цена"
          value={price}
          onChange={(e) => changePrice(e)}
        />
        <div className="mt-3 space-x-3 flex justify-end">
          <Button
            variant="outline"
            color="gray"
            onClick={() => {
              setOpenEdit(false);
              clear();
            }}
          >
            Отмена
          </Button>
          <Button variant="outline" onClick={editProduct}>
            Применить
          </Button>
        </div>
      </Modal>

      {products.length > 0 ? (
        <div className="flex flex-wrap justify-center">
          {products.map((product) => {
            return (
              <Card
                withBorder
                key={product.id}
                className={`h-72 w-72 m-4 rounded-lg ${
                  theme.colorScheme === "dark" ? `bg-[#2C2E33]` : `bg-slate-200`
                }`}
              >
                <LoadingOverlay
                  visible={deletingPr.includes(product.id)}
                  overlayBlur={3}
                />
                <Card.Section>
                  <Image src="/p.png" alt="Image" height={160} />
                </Card.Section>

                <Text>
                  {product.developer} {product.name}
                </Text>
                <Text>{product.description}</Text>
                <div className="flex justify-between items-center">
                  <p className="ml-2 truncate text-lg text-blue-500">
                    {product.price}₴
                  </p>
                  <div className="space-x-3">
                    <Button
                      variant="subtle"
                      size="small"
                      onClick={() => {
                        setOpenEdit(true);
                        setDeveloper(product.developer);
                        setDesc(product.description);
                        setName(product.name);
                        setId(String(product.id));
                        setPrice(String(product.price));
                      }}
                    >
                      Изменить
                    </Button>
                    <Button
                      variant="subtle"
                      size="small"
                      className="text-red-600"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Alert>Ваш список продуктов пуст.</Alert>
      )}
    </div>
  );
};

export default MyProducts;
