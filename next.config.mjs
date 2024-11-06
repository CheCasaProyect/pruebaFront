/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ['i.postimg.cc'], 
  },
//   async rewrites() {
//       return [
//           {
//               source: '/auth/:path*', 
//               destination: 'https://proyectochecasa.onrender.com/auth/:path*', 
//           },
//       ];
//   },
};

export default nextConfig;
