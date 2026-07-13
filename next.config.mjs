/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-plotly.js'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'plotly.js/dist/plotly': 'plotly.js/dist/plotly.min.js',
    };
    return config;
  },
};

export default nextConfig;
