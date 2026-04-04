/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/lite",
        destination: process.env.NEXT_PUBLIC_LITE_URL || "http://localhost:8501",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
