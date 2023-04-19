/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatters: [
      {
        protocol: "https",
        hostname: "**.clodinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
