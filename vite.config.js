import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api/youtube": {
        target: "https://www.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/youtube/, "/youtube/v3"),
      },
    },
  },
  plugins: [youtubeMockPlugin()],
});
