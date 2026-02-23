<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Session;

class CartService
{
    protected ?Cart $cart = null;

    public function __construct()
    {
        // Инициализация отложена до первого обращения,
        // чтобы сессия уже была запущена middleware
    }

    /**
     * Инициализация корзины по сессии (ленивая — при первом обращении)
     */
    protected function initCart(): void
    {
        if ($this->cart !== null) {
            return; // уже инициализировано
        }

        $sessionId = Session::getId();
        $this->cart = Cart::getOrCreateBySession($sessionId);

        // Загружаем items с продуктами
        $this->cart->load('items.product');
    }

    /**
     * Получить текущую корзину
     */
    public function getCart(): Cart
    {
        $this->initCart();
        return $this->cart;
    }

    /**
     * Добавить товар в корзину
     */
    public function addToCart(int $productId, int $quantity = 1): bool
    {
        $this->initCart();
        $product = Product::find($productId);

        if (!$product) {
            return false;
        }

        $cartItem = CartItem::where('cart_id', $this->cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $this->cart->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        $this->refreshCart();
        return true;
    }

    /**
     * Обновить количество товара (delta: +1 или -1)
     */
    public function updateAmount(int $productId, int $delta): bool
    {
        $this->initCart();
        $cartItem = CartItem::where('cart_id', $this->cart->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return false;
        }

        $newAmount = $cartItem->quantity + $delta;

        if ($newAmount <= 0) {
            $cartItem->delete();
        } else {
            $cartItem->quantity = $newAmount;
            $cartItem->save();
        }

        $this->refreshCart();
        return true;
    }

    /**
     * Удалить товар из корзины
     */
    public function removeItem(int $productId): bool
    {
        $this->initCart();
        $deleted = CartItem::where('cart_id', $this->cart->id)
            ->where('product_id', $productId)
            ->delete();

        $this->refreshCart();
        return $deleted > 0;
    }

    /**
     * Очистить корзину
     */
    public function clearCart(): void
    {
        $this->initCart();
        CartItem::where('cart_id', $this->cart->id)->delete();
        $this->refreshCart();
    }

    /**
     * Обновить данные корзины из БД
     */
    protected function refreshCart(): void
    {
        $this->cart->load('items.product');
    }

    /**
     * Получить данные корзины для JSON
     */
    public function getCartData(): array
    {
        $this->initCart();
        $items = [];
        foreach ($this->cart->items as $item) {
            if ($item->product) {
                $items[] = [
                    'productId' => $item->product_id,
                    'amount' => $item->quantity,
                    'data' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'tags' => $item->product->tags ?? [],
                        'img' => $item->product->img ?? '/assets/sfera/images/placeholder.webp',
                    ],
                ];
            }
        }

        return [
            'items' => $items,
            'cartSum' => $this->cart->total_sum,
            'cartAmount' => $this->cart->total_amount,
        ];
    }

    /**
     * Получить сводку корзины (для хедера)
     */
    public function getCartSummary(): array
    {
        $this->initCart();
        return [
            'cartSum' => $this->cart->total_sum,
            'cartAmount' => $this->cart->total_amount,
        ];
    }
}

