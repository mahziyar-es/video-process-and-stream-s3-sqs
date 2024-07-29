/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
      dirs: ['src'],
    },
    images: {
      remotePatterns: [
        {
          hostname: '*',
        },
      ],
    }
};

export default nextConfig;
