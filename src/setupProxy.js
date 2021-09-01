const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        createProxyMiddleware(["/osuauth", "/api", "/beatmapfiles"], {
            target: "http://127.0.0.1:8000",
        })
    );
};
