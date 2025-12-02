import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⚠️ KHÔNG dùng loadEnv ở đây nữa

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    // SỬA LỖI TẠI ĐÂY:
    // Cấu hình alias một cách rõ ràng để Vite có thể phân giải
    // đường dẫn tắt "@"" thành thư mục "src" một cách chính xác.
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      port: 3200,
      open: true,
      host: true,
      // proxy: {
      //   "/api": {
      //     target: env.VITE_API_BASE_URL,
      //     changeOrigin: true,
      //     secure: false,
      //   },
      // },
    },

    build: {
      outDir: "dist",
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            icons: ["lucide-react"],
          },
        },
      },
    },
  }
})
