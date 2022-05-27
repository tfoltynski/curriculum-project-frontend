const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  app.use(
    '/auction/',
    createProxyMiddleware({
      target: process.env.REACT_APP_AUCTION_API_URL,
      pathRewrite: {'^/auction/' : ''},
      changeOrigin: true,
    })
  );

  app.use(
    '/auctionview/',
    createProxyMiddleware({
      target: process.env.REACT_APP_AUCTION_VIEW_API_URL,
      pathRewrite: {'^/auctionview/' : ''},
      changeOrigin: true,
    })
  );
};
