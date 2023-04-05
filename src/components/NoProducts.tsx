import { Alert, useMantineColorScheme } from "@mantine/core";
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const NoProducts = () => {
  const theme = useMantineColorScheme();

  return (
    <div>
      <Alert
        color="red"
        variant={`${theme.colorScheme === "dark" ? `light` : `filled`}`}
        className="text-xl m-4"
      >
        <ExclamationTriangleIcon className="h-4 w-4" /> Вы не можете добавлять
        свои продукты, потому что вы не разработчик ;(
      </Alert>
      <Alert
        variant={`${theme.colorScheme === "dark" ? `light` : `filled`}`}
        className="text-xl m-4"
      >
        <InformationCircleIcon className="w-4 h-4" /> Если вы хотите добавить и
        продавать свои продукты обратитесь в техподдержку.
      </Alert>
    </div>
  );
};

export default NoProducts;
