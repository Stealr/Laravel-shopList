<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogApiController extends Controller
{
    /**
     * Получить список товаров с фильтрацией и пагинацией (AJAX)
     */
    public function getProducts(Request $request): JsonResponse
    {
        // Создаем запрос
        $query = Product::query();

        // Фильтрация по поиску
        $query->when($request->input('search'), function ($q, $search) {
            return $q->where('name', 'like', '%' . $search . '%');
        });

        // Фильтрация по минимальной цене
        $query->when($request->input('min_price'), function ($q, $min) {
            return $q->where('price', '>=', $min);
        });

        // Фильтрация по максимальной цене
        $query->when($request->input('max_price'), function ($q, $max) {
            return $q->where('price', '<=', $max);
        });

        // Пагинация (6 товаров на страницу)
        $paginator = $query->paginate(6);

        // Формируем ответ
        return response()->json([
            'success' => true,
            'products' => $paginator->items(),
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'totalPages'  => $paginator->lastPage(),
                'totalItems'  => $paginator->total()
            ]
        ]);
    }
}

