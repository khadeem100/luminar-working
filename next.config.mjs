/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['luminar-edu.nl'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://luminar-edu.nl',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://luminar-edu.nl http://luminar-edu.nl",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
