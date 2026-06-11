import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Forces Vite to look for the .env file in the absolute current workspace directory
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    root: "src/",
    // Expose env variables natively to prevent loading errors
    define: {
      "import.meta.env.VITE_EXCHANGE_RATE_API_KEY": JSON.stringify(env.VITE_EXCHANGE_RATE_API_KEY)
    },
    build: {
      outDir: "../dist",
      rollupOptions: {
        input: {
          main: resolve(__dirname, "src/index.html"),
        },
      },
    },
  };
});
