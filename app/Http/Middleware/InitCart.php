<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class InitCart
{
    public function handle(Request $request, Closure $next)
    {
        // Логика из вашего router.class.php -> initCartFromDB()

        if (!Session::has('cart')) {
            // Инициализируем пустую
            Session::put('cart', ['items' => [], 'cartSum' => 0, 'cartAmount' => 0]);

            // Если пользователь залогинен (в Laravel это Auth::id(), а не $_SESSION['id'])
            // Здесь можно добавить логику подгрузки старой корзины из БД
            // $user = auth()->user();
            // if ($user) { ... загрузка из таблицы carts ... }
        }

        // recalculateCart() тоже можно вызывать здесь, если корзина менялась

        return $next($request);
    }
}
