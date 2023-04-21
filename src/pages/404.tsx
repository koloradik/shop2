import { Divider, Text } from "@mantine/core";

export default function notFound() {
  return (
    <>
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="text-white text-6xl px-2">404</div>
        <Divider orientation="vertical" size="sm" my={420} />
        <Text className="px-2 text-white text-2xl">Not Found</Text>
      </div>
    </>
  );
}
