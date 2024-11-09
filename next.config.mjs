/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pubchem.ncbi.nlm.nih.gov",
        port: "",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**"
      }
    ]
  },
  swcMinify: false, // Desactiva la minificación para evitar el error de Terser
  webpack(config) {
    if (config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.options && minimizer.options.terserOptions) {
          minimizer.options.terserOptions.output = {
            ...minimizer.options.terserOptions.output,
            ascii_only: true // Solo caracteres ASCII para evitar errores de unicode
          };
        }
      });
    }
    return config;
  }
};

export default nextConfig;
