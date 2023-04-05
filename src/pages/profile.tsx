import Info from "@/components/Info";
import MyProducts from "@/components/MyProducts";
import useAuth from "@/store/auth";
import { Alert, Tabs } from "@mantine/core";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import NoProducts from "@/components/NoProducts";

export default function Profile() {
  const auth = useAuth();

  const [activeTab, setActiveTab] = useState<string | null>("info");

  return (
    <>
      {auth.user ? (
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="info">Профиль</Tabs.Tab>
            {auth.user?.status === "Admin" || auth.user?.status === "Moder" ? (
              <Tabs.Tab value="products">Мои продукты</Tabs.Tab>
            ) : (
              <Tabs.Tab value="cantCrProducts">Мои продукты</Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="info">
            <Info />
          </Tabs.Panel>
          <Tabs.Panel value="products">
            <MyProducts />
          </Tabs.Panel>
          <Tabs.Panel value="cantCrProducts">
            <NoProducts />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <Alert
          color="red"
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          title="Ошибка"
        >
          Вы не авторизованы ;(
        </Alert>
      )}
    </>
  );
}
