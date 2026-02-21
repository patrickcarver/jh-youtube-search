import { youtubeMockPlugin } from "./youtube-mock-plugin.js";
import { loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [youtubeMockPlugin(env)],
    server: {
      proxy: {
        "/api/youtube": {
          target: "https://www.googleapis.com",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api\/youtube/, "/youtube/v3");
          },
        },
      },
    },
  };
};
