<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'shopList')</title>

    {{-- Подключение скриптов (cart.js и др.) --}}
    @include('partials.scripts')

    {{-- Базовые стили и скрипты --}}
    @vite([
        'resources/css/app.css',
        'resources/css/header.css',
        'resources/js/app.js',
    ])

    {{-- Дополнительные стили/скрипты конкретной страницы --}}
    @stack('vite')

    {{-- Произвольный head контент страницы --}}
    @stack('head')
</head>
<body>

@include('partials.header')

<main class="@yield('main-class', 'modular-grid')">
    @yield('content')
</main>

@stack('scripts')

</body>
</html>

