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

        <div class="header__auth">
            @auth
                <a href="{{ route('account') }}" class="header__auth-link">Личный кабинет</a>
                <form method="POST" action="/logout" style="display:inline;">
                    @csrf
                    <button type="submit" class="header__auth-logout">Выйти</button>
                </form>
            @else
                <a href="/login" class="header__auth-link">Войти</a>
                <a href="/register" class="header__auth-link">Регистрация</a>
            @endauth
        </div>
    </div>
</header>
