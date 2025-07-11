import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

export default ({mode}) => {
    const environment = loadEnv(mode, process.cwd());
    const baseUrl = environment.VITE_API_URL || "http://localhost:8080";

    console.log(`API URL: ${baseUrl}`);
    return defineConfig({
        plugins: [react()],
        base: "/",
        server: {
            historyApiFallback: true,

            proxy: {
                "/api": {
                    target: baseUrl,
                    changeOrigin: true,
                },

                // "/customer": {
                //     target: baseUrl,
                //     changeOrigin: true,
                // },

                // "/customer/create": {
                //     target: baseUrl,
                //     changeOrigin: true,
                // },

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

                "/dashboard/summary": {
                    target: baseUrl,
                    changeOrigin: true,
                },
            },
        },
        appType: 'spa',
    });
};
