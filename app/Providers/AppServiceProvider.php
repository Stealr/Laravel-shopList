<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // Вариант 1: Передать переменную ВО ВСЕ шаблоны (*)
        // Это аналог того, как в router.class.php вы делали assign в Smarty глобально
        View::composer('*', function ($view) {

            // Получаем корзину из сессии (или пустую структуру, если её нет)
            $cartData = session('cart', [
                'items' => [],
                'cartSum' => 0,
                'cartAmount' => 0
            ]);

            // Если нужно - подготавливаем данные (как в вашем старом коде array_values)
            if (!empty($cartData['items'])) {
                $cartData['items'] = array_values($cartData['items']);
            }

            // Передаем переменную $cartJson во все вьюхи
            $view->with('cartJson', json_encode($cartData, JSON_UNESCAPED_UNICODE));
        });
    }
}
