<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Отображение страницы каталога
     */
    public function index(Request $request)
    {
        // Создаем запрос
        $query = Product::query();

        // Фильтрация
        $query->when($request->input('search'), function ($q, $search) {
            return $q->where('name', 'like', '%' . $search . '%');
        });

        $query->when($request->input('min_price'), function ($q, $min) {
            return $q->where('price', '>=', $min);
        });

        $query->when($request->input('max_price'), function ($q, $max) {
            return $q->where('price', '<=', $max);
        });

        // Пагинация
        $paginator = $query->paginate(6);

        // Формируем данные для первичной загрузки
        $catalogData = [
            'success' => true,
            'products' => $paginator->items(),
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'totalPages'  => $paginator->lastPage(),
                'totalItems'  => $paginator->total()
            ]
        ];

        // Получаем данные корзины
        $cartData = $this->cartService->getCartData();

        return view('catalog.index', [
            'filters' => $request->all(),
            'catalogData' => $catalogData,
            'cartData' => $cartData,
        ]);
    }
}
