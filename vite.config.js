import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/Images': {
        target: 'https://evolvify.runasp.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/Images/, '/Images'),
      },
    },
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          ffmpeg: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
        },
      },
    },
  },
  assetsInclude: ["**/*.wasm"],
});