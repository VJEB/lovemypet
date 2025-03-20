import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
    css: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
    plugins: [
        vue(), 
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
