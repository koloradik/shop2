import { Text, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";

const Halp = () => {
  const theme = useMantineColorScheme();
  return (
    <>
      <div className={`text-xl flex justify-center mt-4`}>
        Если вас обманули, купили товар от вашего имени, и т.д. вы всегда можете
        обратится сюда:
      </div>

      <div className="flex space-x-7 justify-center mt-5 text-lg">
        <Link
          target="_blank"
          className={`no-underline ${
            theme.colorScheme === "dark" ? `text-violet-500` : `text-violet-700`
          }`}
          href="https://www.youtube.com/watch?v=P37mn84nabg"
        >
          Viber
        </Link>

        <Link
          target="_blank"
          className={`no-underline ${
            theme.colorScheme === "dark" ? `text-blue-500` : `text-blue-700`
          }`}
          href="https://play.google.com/store/apps/details?id=org.telegram.messenger&hl=ru&gl=US"
        >
          Telegram
        </Link>

        <Link
          target="_blank"
          className={`no-underline ${
            theme.colorScheme === "dark" ? `text-pink-500` : `text-pink-700`
          }`}
          href="https://www.instagram.com/p/CpcsWTsspvr/"
        >
          Instagram
        </Link>
      </div>

      <div className={`text-xl flex justify-center mt-4`}>
        Также вы можете обратится сюда если хотите добавить свою игру в магазин.
      </div>
    </>
  );
};

export default Halp;
