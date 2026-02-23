import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/css/header.css',
                'resources/css/productCard.css',
                'resources/css/catalog.css',
                'resources/css/cart.css',
                'resources/js/app.js',
                'resources/js/catalog.js',
                'resources/js/cart.js',
                'resources/js/cartPage.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
