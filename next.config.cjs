/** CommonJS wrapper to support Next.js config when package set to type module */
const config = {
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['firebase']
  }
};
module.exports = config;
