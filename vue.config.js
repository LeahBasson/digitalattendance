const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8084,
    proxy: {
      '/api': {
        target: 'https://attendance-tagging-system.lcstudio.co.za',
        changeOrigin: true,
        secure: false,
        ws: true,
        pathRewrite: {
          '^/api': ''
        },
        onProxyReq(proxyReq) {
          // Add CORS headers
          proxyReq.setHeader('Origin', 'https://attendance-tagging-system.lcstudio.co.za');
          console.log('Proxying:', proxyReq.path);
        },
        onProxyRes(proxyRes) {
          // Add CORS headers to response
          proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
          proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        },
        onError(err, req, res) {
          console.error('Proxy error:', err);
        }
      }
    }
  }
})
