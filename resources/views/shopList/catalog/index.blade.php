<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Каталог | shopList</title>

    {{-- Подключение фавиконки --}}
{{--    @include('shopList.tpl.favicon')--}}

    {{-- Подключение скриптов --}}
    @include('shopList.partials.scripts')

    {{-- Ссылки на статику через Vite --}}
    @vite([
        'resources/css/app.css',
        'resources/css/header.css',
        'resources/css/productCard.css',
        'resources/css/catalog.css',
        'resources/js/app.js',
        'resources/js/catalog.js'
    ])
</head>
<body>

@include('shopList.partials.header')

<main class="catalog-page modular-grid">
    <h1 style="margin-bottom: 20px">Каталог</h1>
    @dump([
        'filters' => $filters,
        'catalogData' => $catalogData,
        'cartData' => $cartData,
        'request_all' => request()->all(),
        'query_params' => request()->query(),
    ])
    <div class="card p-3 mb-4">
        {{-- Knockout перехватывает submit, action не обязателен --}}
        <form data-bind="submit: applyFilter">
            <div class="row align-items-end">
                <div class="col-md-4">
                    <label>Поиск</label>
                    {{-- request('search') — удобный доступ к get параметрам в blade --}}
                    <input type="text" name="search" class="form-control"
                           placeholder="Название товара"
                           value="{{ request('search') }}">
                </div>

                <div class="col-md-3">
                    <label>Цена от</label>
                    <input type="number" name="min_price" class="form-control"
                           placeholder="0"
                           value="{{ request('min_price') }}">
                </div>

                <div class="col-md-3">
                    <label>Цена до</label>
                    <input type="number" name="max_price" class="form-control"
                           placeholder="10000"
                           value="{{ request('max_price') }}">
                </div>

                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary w-100">Найти</button>
                </div>
            </div>

            <div class="mt-2">
                <a href="{{ route('catalog.index') }}" class="text-secondary small">Сбросить фильтры</a>
            </div>
        </form>
    </div>

    {{-- Секция с товарами, Knockout обрабатывает foreach --}}
    <div class="catalog-page__products-grid list-products" data-bind="foreach: products">
        @include('shopList.components.product-card')
    </div>

    <div data-bind="if: products().length === 0" class="text-center mt-5" style="display: none">
        <p class="text-muted">Товары не найдены</p>
    </div>

    {{-- Пагинация Knockout --}}
    <div class="mt-4 mb-5" data-bind="if: totalPages() > 1">
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item" data-bind="css: { disabled: currentPage() === 1 }">
                    <a class="page-link" href="#" data-bind="click: goToPrevPage">&laquo;</a>
                </li>
                <!-- ko foreach: pages -->
                <li class="page-item" data-bind="css: { active: $data === $parent.currentPage() }">
                    <a class="page-link" href="#" data-bind="text: $data, click: function() { $parent.goToPage($data); return false; }"></a>
                </li>
                <!-- /ko -->
                <li class="page-item" data-bind="css: { disabled: currentPage() === totalPages() }">
                    <a class="page-link" href="#" data-bind="click: goToNextPage">&raquo;</a>
                </li>
            </ul>
        </nav>
    </div>
</main>

{{-- Передача данных из PHP в JS --}}
<script>
    window.catalogData = @json($catalogData);
    window.cartData = @json($cartData);
</script>


</body>
</html>
