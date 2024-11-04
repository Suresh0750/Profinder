// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


// next.config.js
 /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'profinder.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com', // Add Unsplash here
        port: '',
        pathname: '/**', // Allow any path from Unsplash
      },
    ],
  },
};

export default nextConfig;