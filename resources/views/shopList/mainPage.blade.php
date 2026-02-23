<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>shopList</title>

    {{-- Подключение скриптов --}}
    @include('shopList.partials.scripts')

    {{-- Ссылки на статику через Vite --}}
    @vite([
        'resources/css/app.css',
        'resources/css/header.css',
        'resources/js/app.js',
    ])
</head>
<body>

@include('shopList.partials.header')

<!-- Main Content -->
<main class="main-page-page modular-grid">
    <h1>Это главная страница сайта</h1>
</main>

</body>
</html>
