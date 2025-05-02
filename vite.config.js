import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default ({ mode }) => {
  const environment = loadEnv(mode, process.cwd());
  const baseUrl = environment.VITE_API_URL || "http://localhost:8080";

  console.log(`API URL: ${baseUrl}`);
  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "/customer-service": {
          target: baseUrl,
          changeOrigin: true,
        },

        "/services": {
          target: baseUrl,
          changeOrigin: true,
        },

        "/employees": {
          target: baseUrl,
          changeOrigin: true,
        },

        "/": {
          target: baseUrl,
          changeOrigin: true,

          bypass: (req) => {
            // Don't proxy Vite's internal requests or static assets
            if (
              req.url.startsWith("/@") ||
              req.url.startsWith("/src/") ||
              req.url.startsWith("/node_modules/") ||
              req.url.indexOf("?") > 0 ||
              req.url.endsWith(".js") ||
              req.url.endsWith(".css") ||
              req.url.endsWith(".svg") ||
              req.url.endsWith(".png") ||
              req.url === "/" ||
              req.url === "/index.html"
            ) {
              return req.url;
            }
          },
        },
      },
    },
  });
};
