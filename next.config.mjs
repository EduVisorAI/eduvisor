/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pubchem.ncbi.nlm.nih.gov",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
