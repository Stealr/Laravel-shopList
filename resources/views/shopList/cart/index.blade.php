@extends('shopList.layouts.app')

@section('title', 'Корзина | shopList')

@push('vite')
    @vite([
        'resources/css/productCard.css',
        'resources/css/cart.css',
        'resources/js/cartPage.js',
    ])
@endpush

@section('main-class', 'cart-page modular-grid')

@section('content')
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
                <x-product-card />
                {{-- или можно @include('shopList.components.product-card') --}}
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

@endsection

@push('scripts')
<script>
    window.cartData = @json($cartData);
    window.cartPageData = @json($cartData);
</script>
@endpush


