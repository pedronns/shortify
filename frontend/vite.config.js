import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    dev: {
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: false,
            },
        },
    },
})
