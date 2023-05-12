import Info from "@/components/Info";
import MyProducts from "@/components/MyProducts";
import { Alert, Tabs } from "@mantine/core";
import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import NoProducts from "@/components/NoProducts";
import Wishlist from "@/components/Wishlist";
import { useSession } from "next-auth/react";

export default function Profile() {
  const session = useSession();

  const [activeTab, setActiveTab] = useState<string | null>("info");

  return (
    <>
      {session.status === "authenticated" ? (
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="info">Профиль</Tabs.Tab>
            <Tabs.Tab value="products">Мои продукты</Tabs.Tab>

            {/* {auth.user?.role === "Admin" || auth.user?.role === "Moder" ? (
            ) : (
              <Tabs.Tab value="cantCrProducts">Мои продукты</Tabs.Tab>
            )} */}

            <Tabs.Tab value="wishlist">Список желаний</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info">
            <Info />
          </Tabs.Panel>

          <Tabs.Panel value="products">
            <MyProducts />
          </Tabs.Panel>

          <Tabs.Panel value="wishlist">
            <Wishlist />
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
