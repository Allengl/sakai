/** @type {import('next').NextConfig} */

let nextConfig = {};

if (process.env.NODE_ENV === 'production') {
  nextConfig = {
    output: 'export',
    distDir: 'dists',
    assetPrefix: '/portal/apps/com.awspaas.user.apps.app20231017165850/', // 配置静态资源前缀
    basePath: '/portal/apps/com.awspaas.user.apps.app20231017165850', // 配置路由跳转时的前缀
    trailingSlash: true,
    // eslint: {
    //   ignoreDuringBuilds: true, // 忽略 eslint 检查
    // },
    // typescript: {
    //   ignoreBuildErrors: true, // 忽略 TypeScript 检查
    // },
    reactStrictMode: true, // React Strict mode
  };
}

module.exports = nextConfig;
