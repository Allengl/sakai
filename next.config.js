/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true   //配置图片不压缩
  },
  // basePath: '/portal/apps/com.awspaas.user.apps.app20231017165850',    //配置路由跳转时的前缀
  eslint: {
    ignoreDuringBuilds: true, //忽略eslint检查
  },
  typescript: {
    ignoreBuildErrors: true, //忽略ts检查
  },
  reactStrictMode: true, //严格模式
}

module.exports = nextConfig
