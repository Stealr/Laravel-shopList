## Отношения (Relationships)

В реляционных базах данных таблицы связаны через ID. В Laravel Models мы связываем их через методы.

Модель Cart.php:

```php
public function items()
{
return $this->hasMany(CartItem::class);
}
```

Модель CartItem.php:

```php
public function product()
{
return $this->belongsTo(Product::class);
}
```

Что это дает?
Это позволяет «гулять» по базе данных, как по объектам, не думая об JOIN-ах.

Пример из жизни:

```php
// 1. Находим корзину
$cart = Cart::find(1);

// 2. Получаем все товары в ней (Laravel сам сделает запрос в таблицу cart_items)
foreach ($cart->items as $item) {

    // 3. Выводим название продукта (Laravel прыгнет в таблицу products по product_id)
    echo "Товар: " . $item->product->name;
    echo "Кол-во: " . $item->quantity;
}
```

Вместо сложного SQL с двумя JOIN, ты просто пишешь `$cart->items` и `$item->product`. Красота!

```
Таблица Cart (объект)
├── id: 1
├── session_id: "abc..."
└── items: [ (Коллекция объектов таблицы CartItem)
      ├── CartItem (объект 1)
      │    ├── id: 10
      │    ├── quantity: 2
      │    └── product: (объект таблицы Product)
      │         ├── id: 5
      │         ├── name: "iPhone 15"
      └──     └── price: 1000
```

Обратный путь (Product → CartItem)
Если ты пропишешь связь в модели Product, ты сможешь даже узнать, в каких корзинах лежит этот конкретный товар.
