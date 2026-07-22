import { defineConfig } from "vite"
import { fileURLToPath, URL } from "url"
import postcss from "./postcss.config.js"
import react from "@vitejs/plugin-react"
import dns from "dns"
import { visualizer } from "rollup-plugin-visualizer"

dns.setDefaultResultOrder("verbatim")

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: [
    './public/piper/ort-wasm-simd-threaded.wasm',
    './public/piper/piper_phonemize.wasm',
    './public/piper/piper_phonemize.data',
  ],
  worker: {
    format: 'es'
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "/proxy": {
        target: "http://localhost:3001",
        changeOrigin: true
      },
      "/api/proxy/nvidia": {
        target: "https://integrate.api.nvidia.com/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/nvidia/, "")
      },
      "/api/proxy/openrouter": {
        target: "https://openrouter.ai/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/openrouter/, "")
      },
      "/api/proxy/groq": {
        target: "https://api.groq.com/openai/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy\/groq/, "")
      }
    }
  },
  define: {
    "process.env": process.env
  },
  css: {
    postcss
  },
  plugins: [
    react(),
    visualizer({
      template: "treemap", // or sunburst
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "bundleinspector.html" // will be saved in project's root
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url))
      }
    ]
  }
})
