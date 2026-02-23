<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Product extends Model
{
    protected $table = 'products';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'price',
        'tags',
    ];

    // В старом коде: $product['tags'] = json_decode(...)
    // В Laravel это делается автоматически через кастинг:
    protected $casts = [
        'tags' => 'array',
    ];

    // Добавляем img в JSON представление
    protected $appends = ['img'];

    /**
     * Получить URL изображения товара
     */
    protected function img(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->attributes['img'] ?? '/assets/sfera/images/placeholder.webp',
        );
    }
}
