<?php

namespace App\Providers;

use App\Services\CartService;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Регистрируем CartService как singleton, чтобы за один запрос
        // корзина инициализировалась только один раз
        $this->app->singleton(CartService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Передаём данные корзины во все шаблоны через CartService (singleton)
        // Применяется как к partials.header, так и к главному layout
        View::composer(
            'shopList.layouts.app',
            function ($view) {
                /** @var CartService $cartService */
                $cartService = app(CartService::class);
                $cartData = $cartService->getCartData();

                $view->with('cartJson', json_encode($cartData, JSON_UNESCAPED_UNICODE));
            }
        );
    }
}
