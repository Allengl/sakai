/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dists/portal/apps/com.awspaas.user.apps.app20231017165850',
  assetPrefix: '/portal/apps/com.awspaas.user.apps.app20231017165850/', //配置静态资源前缀
  basePath: '/portal/apps/com.awspaas.user.apps.app20231017165850',    //配置路由跳转时的前缀
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true, //忽略eslint检查
  },
  typescript: {
    ignoreBuildErrors: true, //忽略ts检查
  },
  reactStrictMode: true, //严格模式
}

module.exports = nextConfig
