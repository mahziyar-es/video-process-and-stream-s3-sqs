/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
      dirs: ['src'],
    },
};

export default nextConfig;
