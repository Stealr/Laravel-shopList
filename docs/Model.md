# Models

механизм называется Eloquent ORM (Object-Relational Mapping)

## Связь: Код <-> База Данных

Посмотри на твой файл app/Models/Product.php.

```php
class Product extends Model
{
    protected $table = 'products';
    // ...
}
```

Как это работает «под капотом»:

1. Класс: У тебя есть класс Product.
2. Таблица: Laravel автоматически ищет в базе данных таблицу products (имя класса + s во множественном числе).
3. Строка: Каждый объект $product в твоем коде — это одна строка в таблице.
4. Свойство: Каждый столбец в таблице (например, price) становится свойством объекта ($product->price).

Тебе не нужно писать SQL-запросы вроде SELECT * FROM products WHERE id = 1. Ты просто пишешь:

```php
$product = Product::find(1);
echo $product->price;
```

## Основные операции (CRUD)

Давай посмотрим, как твои контроллеры используют модели.

### А. Чтение (Read)

В CatalogController.php ты делаешь:

```php
$query = Product::query();
// ... фильтры ...
$paginator = $query->paginate(6);
```

Laravel берет модель Product, строит сложный SQL-запрос на основе твоих фильтров и возвращает коллекцию (массив)
объектов.

### Б. Создание (Create)

В CartService.php (метод addToCart) есть такой код:

```php
CartItem::create([
'cart_id' => $cart->id,
'product_id' => $product->id,
'quantity' => 1,
'price' => $product->price
]);
```

Метод create берет массив, превращает его в SQL INSERT INTO cart_items ... и сохраняет в базу.

### В. Обновление (Update)

В том же CartService.php:

```php
$item->quantity = $quantity;
$item->save();
```

Ты меняешь свойство объекта PHP, а метод save() понимает: «Ага, это изменение», и генерирует UPDATE cart_items SET
quantity = ....

### Г. Удаление (Delete)

```php
$item->delete();
```

Генерирует DELETE FROM ....

## Защита данных ($fillable)

В файле CartItem.php ты видишь:

```php
protected $fillable = [
'cart_id',
'product_id',
'quantity',
'price'
];
```

Зачем это нужно?
Это «белый список» полей, которые разрешено заполнять массово (через метод create() или update()).
Представь, что хакер отправит форму, добавив скрытое поле is_admin = 1. Если бы
не $fillable, Laravel молча записал бы это в базу. Но с $fillable он проигнорирует всё, чего нет в этом списке.

## Отношения (Relationships) — Самая мощная часть

В реляционных базах данных таблицы связаны через ID. В Laravel Models мы связываем их через методы.

Посмотри файл Cart.php:

```php
public function items()
{
return $this->hasMany(CartItem::class);
}
```

И файл CartItem.php:

```php
public function product()
{
return $this->belongsTo(Product::class);
}
```

Что это дает?
Это позволяет тебе «гулять» по базе данных, как по объектам, не думая об JOIN-ах.

Пример из жизни (представь, что ты пишешь это в контроллере):

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
Cart (объект)
├── id: 1
├── session_id: "abc..."
└── items: [ (Коллекция объектов CartItem)
      ├── CartItem (объект 1)
      │    ├── id: 10
      │    ├── quantity: 2
      │    └── product: (объект Product)
      │         ├── id: 5
      │         ├── name: "iPhone 15"
      └──     └── price: 1000
```

Обратный путь (Product → CartItem)  
Если ты пропишешь связь в модели Product, ты сможешь даже узнать, в каких корзинах лежит этот конкретный товар.

## Аксессоры и Мутаторы (Умные поля)

В Product.php у тебя есть метод:

```php
public function img()
{
// Возвращает путь к картинке или заглушку
return $this->image ?? asset('images/no-image.png');
}
```

## fistOrCreate

```php
$cart = Cart::firstOrCreate(['session_id' => session()->getId()]);
```

Что здесь происходит?

- first: Laravel ищет в таблице carts строку, где session_id совпадает с текущим ID сессии пользователя.
- OrCreate: Если не нашел (пользователь только что зашел), он сам создаст новую строку в базе и вернет её объект.
- Итог: У тебя в переменной $cart всегда есть объект корзины, и тебе не нужно писать if ($cart == null).

## updateOrCreate
Вместо
```php
// Ищем, есть ли уже такой товар в ЭТОЙ корзине
$cartItem = CartItem::where('cart_id', $cart->id)
    ->where('product_id', $product->id)
    ->first();

if ($cartItem) {
    // Сценарий 2: Товар найден, просто обновляем цифру
    $cartItem->quantity += 1;
    $cartItem->save();
} else {
    // Сценарий 1: Товара нет, создаем новую запись
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'quantity' => 1,
        'price' => $product->price
    ]);
}
```
Можно прописать
```php
$cart->items()->updateOrCreate(
    ['product_id' => $product->id], // По какому полю искать
    ['quantity' => \DB::raw('quantity + 1'), 'price' => $product->price] // Что обновить или вставить
);
```

---
Хотя это не стандартный аксессор Laravel (они обычно называются getImageAttribute), суть та же. Модель может содержать
логику отображения данных.
Вместо того чтобы в каждом HTML-файле писать проверку if ($product->image), ты просто пишешь везде $product->img(). Если
логика изменится, ты поменяешь её только в одном месте — в Модели.

Итог: Как думать о Модели?

1. Модель — это отражение таблицы.
2. Модель — это страж данных (через $fillable и валидацию типов).
3. Модель — это карта связей (она знает, как Cart связана с Product).

Ты уже используешь их очень правильно, разделяя логику:

1. Controller: принимает решение.
2. Service: выполняет бизнес-операцию (добавить в корзину).
3. Model: непосредственно общается с базой данных.
