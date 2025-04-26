import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        // Mantén tu configuración de alias si la tienes
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    build: {
        outDir: "dist",
        sourcemap: true
    }
});
