<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Корзина | shopList</title>

    {{-- Подключение скриптов --}}
    @include('shopList.partials.scripts')

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
<body>

@include('shopList.partials.header')

<main class="cart-page modular-grid">
    <h1 style="margin-bottom: 20px">Корзина</h1>

    {{-- Пустая корзина --}}
    <div data-bind="visible: items().length === 0" class="cart-empty" style="display: none;">
        <p>Ваша корзина пуста</p>
        <a href="/catalog" class="btn btn-primary">Перейти в каталог</a>
    </div>

    {{-- Корзина с товарами --}}
    <div data-bind="visible: items().length > 0" class="cart-content d-flex justify-content-between" style="display: none;">
        {{-- Список товаров --}}
        <div class="cart-items flex-grow-1" style="margin-right: 20px;">
            <div class="cart-products-grid" data-bind="foreach: items">
                @include('shopList.components.product-card')
            </div>
        </div>

        {{-- Итоговая информация --}}
        <div class="cart-summary" style="min-width: 300px;">
            <div class="cart-summary__card card p-3">
                <h4>Итого</h4>
                <p>Количество товаров: <span data-bind="text: cartAmount"></span></p>
                <p class="h5">Общая сумма: <span data-bind="text: cartSum"></span>₽</p>
                <button class="btn btn-success w-100 mt-3" data-bind="click: submitOrder">
                    Оформить заказ
                </button>
                <button class="btn btn-outline-danger w-100 mt-2" data-bind="click: clearCart">
                    Очистить корзину
                </button>
            </div>
        </div>
    </div>
</main>

{{-- Передача данных из PHP в JS --}}
<script>
    window.cartData = @json($cartData);
    window.cartPageData = @json($cartData);
</script>

</body>
</html>


