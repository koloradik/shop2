import { useMantineColorScheme } from "@mantine/core";

const WhereWe = () => {
  const theme = useMantineColorScheme();

  return (
    <>
      <div className="flex justify-around items-center mt-6">
        <div
          className={`text-3xl ${
            theme.colorScheme === "dark" ? `text-white` : `text-black`
          }`}
        >
          Наши отделения:
        </div>
        <div className="space-y-3 text-lg">
          <a
            className={`flex justify-center link link-hover no-underline ${
              theme.colorScheme === "dark" ? `text-sky-400` : `text-blue-700`
            }`}
            href="https://maps.google.com/maps?q=-67.997757,94.568033&ll=-67.997757,94.568033&z=16"
            target={"_blank"}
          >
            Отделение 1
          </a>
          <a
            className={`flex justify-center link link-hover no-underline ${
              theme.colorScheme === "dark" ? `text-sky-400` : `text-blue-700`
            }`}
            href="https://maps.google.com/maps?q=48.555415,39.316354&ll=48.555415,39.316354&z=16"
            target={"_blank"}
          >
            Отделение 2
          </a>
          <a
            className={`flex justify-center link link-hover no-underline ${
              theme.colorScheme === "dark" ? `text-sky-400` : `text-blue-700`
            }`}
            href="https://maps.google.com/maps?q=17.058250,8.713251&ll=17.058250,8.713251&z=16"
            target={"_blank"}
          >
            Отделение 3
          </a>
          <a
            className={`flex justify-center link link-hover no-underline ${
              theme.colorScheme === "dark" ? `text-sky-400` : `text-blue-700`
            }`}
            href="https://maps.google.com/maps?q=31.580954,54.460642&ll=31.580954,54.460642&z=16"
            target={"_blank"}
          >
            Отделение 4
          </a>
          <a
            className={`flex justify-center link link-hover no-underline ${
              theme.colorScheme === "dark" ? `text-sky-400` : `text-blue-700`
            }`}
            href="https://maps.google.com/maps?q=25.204504,55.242362&ll=25.204504,55.242362&z=16"
            target={"_blank"}
          >
            Отделение 5
          </a>
        </div>
      </div>
    </>
  );
};

export default WhereWe;
