<header class="header">
    <div class="header__container modular-grid">
        <a href="/">
            SHlist
        </a>

        <div>
            <a href="{{route('catalog.index')}}">Каталог</a>
        </div>

        <a href="{{route('cart.index')}}" id="cartLink">
            Корзина (<span id="cartAmount" data-bind="text: cartAmount">0</span>) - <span id="cartSum" data-bind="text: cartSum">0</span>₽
        </a>
    </div>
</header>
