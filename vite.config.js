import { defineConfig } from 'vite';
import { resolve } from 'path';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/header.css',
                'resources/css/productCard.css',
                'resources/css/catalog.css',
                'resources/css/cart.css',
                'resources/css/auth.css',
                'resources/css/account.css',
                'resources/js/app.js',
                'resources/js/catalog.js',
                'resources/js/cart.js',
                'resources/js/cartPage.js',
                'resources/js/room/src/react/main.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'resources/js/room/src/react/components'),
            '@hooks': resolve(__dirname, 'resources/js/room/src/react/hooks'),
            '@services': resolve(__dirname, 'resources/js/room/src/react/services'),
            '@stores': resolve(__dirname, 'resources/js/room/src/react/stores'),
            '@helpers': resolve(__dirname, 'resources/js/room/src/react/helpers'),
            '@styles': resolve(__dirname, 'resources/js/room/src/styles'),
            '@assets': resolve(__dirname, 'resources/js/room/src/assets'),
            '@': resolve(__dirname, 'resources/js/room/src'),
            '@react': resolve(__dirname, 'resources/js/room/src/react'),
            '@app': resolve(__dirname, 'resources/js/room/src/react/app'),
            '@routes': resolve(__dirname, 'resources/js/room/src/react/app/routes'),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
