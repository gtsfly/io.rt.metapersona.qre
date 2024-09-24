const { defineConfig } = require("@vue/cli-service");
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://localhost:7037", // Backend URL'sini buraya ekleyin
        changeOrigin: true,
      },
    },
  },
};
