## Полезные вещи

пакет для автоматического переноса
kitloong/laravel-migrations-generator

...

вставка статики через vite
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Корзина | shopList</title>

    {{-- Ссылки на статику через Vite --}}
    @vite([
        'resources/css/app.css',
        'resources/css/header.css',
        'resources/css/productCard.css',
        'resources/css/cart.css',
        'resources/js/app.js',
        'resources/js/cartPage.js'
    ])
</head>
```
