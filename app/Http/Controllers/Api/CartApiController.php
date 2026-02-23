<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartApiController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Получить данные корзины
     */
    public function getCart(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'cart' => $this->cartService->getCartData(),
        ]);
    }

    /**
     * Добавить товар в корзину
     */
    public function addToCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'integer|min:1',
        ]);

        $productId = $validated['product_id'];
        $quantity = $validated['quantity'] ?? 1;

        $success = $this->cartService->addToCart($productId, $quantity);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'cart' => $this->cartService->getCartSummary(),
        ]);
    }

    /**
     * Обновить количество товара в корзине
     */
    public function updateCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer', // delta: +1 или -1
        ]);

        $productId = $validated['product_id'];
        $delta = $validated['quantity'];

        $success = $this->cartService->updateAmount($productId, $delta);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Товар не найден в корзине',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'cart' => $this->cartService->getCartSummary(),
        ]);
    }

    /**
     * Удалить товар из корзины
     */
    public function removeFromCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|integer',
        ]);

        $success = $this->cartService->removeItem($validated['product_id']);

        return response()->json([
            'success' => $success,
            'cart' => $this->cartService->getCartSummary(),
        ]);
    }

    /**
     * Очистить корзину
     */
    public function clearCart(): JsonResponse
    {
        $this->cartService->clearCart();

        return response()->json([
            'success' => true,
            'cart' => $this->cartService->getCartSummary(),
        ]);
    }
}

