const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/mockdata',
    createProxyMiddleware({
      target: 'http://www.mocky.io',
      changeOrigin: true,
      pathRewrite: {
        '^/api/mockdata': '/v2/5c7db5e13100005a00375fda',
      },
    })
  );
};
