/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-9e87358252234923985c8cd9daf30e20.r2.dev",
      },
    ],
  },
}

export default nextConfig
