<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Показать страницу корзины
     */
    public function index(Request $request): View
    {
        $cartData = $this->cartService->getCartData();

        return view('cart.index', [
            'cartData' => $cartData,
        ]);
    }
}
