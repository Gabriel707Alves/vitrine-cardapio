import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Fotos remotas dos clientes (Google Maps / Perfil da Empresa e WhatsMenu).
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.whatsmenu.com.br" },
      { protocol: "https", hostname: "whatsmenu.com.br" },
    ],
  },
};

export default nextConfig;
