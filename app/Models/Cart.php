<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $table = 'carts';

    protected $fillable = [
        'session_id',
    ];

    /**
     * Элементы корзины
     */
    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Получить или создать корзину по session_id
     */
    public static function getOrCreateBySession(string $sessionId): self
    {
        return self::firstOrCreate(['session_id' => $sessionId]);
    }

    /**
     * Общее количество товаров в корзине
     */
    public function getTotalAmountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    /**
     * Общая сумма корзины
     */
    public function getTotalSumAttribute(): float
    {
        return $this->items->sum(function ($item) {
            return $item->quantity * ($item->product->price ?? 0);
        });
    }
}

