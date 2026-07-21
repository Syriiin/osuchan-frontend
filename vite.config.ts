/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        host: process.env.HOST || "localhost",
        port: 3000,
        proxy: {
            "/osuauth": {
                target: "http://127.0.0.1:8000",
            },
            "/api": {
                target: "http://127.0.0.1:8000",
            },
            "/beatmapfiles": {
                target: "http://127.0.0.1:8000",
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
    },
});
