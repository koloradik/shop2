import { Text, useMantineColorScheme } from "@mantine/core";
import Link from "next/link";

const Footer = () => {
  const theme = useMantineColorScheme();

  return (
    <div
      className={`flex h-52 w-full py-3 border-black sticky top-0 z-50 space-x-2 rounded-lg ${
        theme.colorScheme === "dark" ? `bg-[#2C2E33]` : `bg-slate-200`
      }`}
    >
      <div className=" flex items-center ml-[10%] text-5xl font-semibold w-2/5">
        <Text
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          className="
        bg-clip-text text-transparent bg-gradient-to-r from-violet-700 from-20% to-orange-600 to-80%
        "
        >
          G o r a
        </Text>
      </div>
      <div className="flex justify-between w-2/5">
        <div>
          <p className="text-lg font-semibold">Связь:</p>
          <div>
            <Link
              target="_blank"
              className={`no-underline ${
                theme.colorScheme === "dark"
                  ? `text-violet-500`
                  : `text-violet-700`
              }`}
              href="https://www.viber.com/ru/download/"
            >
              Viber
            </Link>
          </div>

          <Link
            target="_blank"
            className={`no-underline ${
              theme.colorScheme === "dark" ? `text-blue-500` : `text-blue-700`
            }`}
            href="https://t.me/pivasov_beershop"
          >
            Telegram
          </Link>

          <div>
            <Link
              target="_blank"
              className={`no-underline ${
                theme.colorScheme === "dark" ? `text-pink-500` : `text-pink-700`
              }`}
              href="https://www.instagram.com/p/Co0EedojV4z/"
            >
              Instagram
            </Link>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold">Карта сайта:</p>
          <div className="flex flex-col">
            <Link className="no-underline" href="whereWe">
              Где мы?
            </Link>
            <Link
              className={`no-underline ${
                theme.colorScheme === "dark"
                  ? `text-yellow-400`
                  : `text-yellow-600`
              }`}
              href="halp"
            >
              Техподдержка
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
