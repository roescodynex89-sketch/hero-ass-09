/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
 {
        protocol: 'https',
        hostname: 'www.google.com',
      },



    ],
  },
};

export default nextConfig;
