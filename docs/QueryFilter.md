## Реализация паттерна Query Filters
Query Filters — это специальные классы, куда выносится вся логика фильтрации базы данных.

### Для чего они нужны?
- Чистые контроллеры: Контроллер просто говорит: «Отфильтруй товары по тем данным, что пришли», не вникая в детали.
- Повторное использование: Ты можешь использовать один и тот же фильтр в обычном каталоге и в каком-нибудь API для мобильного приложения.
- Удобство тестирования: Можно тестировать логику фильтрации отдельно от веб-страницы.

### Состоит из трех шагов:
1. Абстрактный класс QueryFilter (база, которую можно использовать для любых моделей).
2. Конкретный фильтр ProductFilter (где лежит логика именно для товаров).
3. Подключение в Модель и Контроллер.

### Шаг 1. Создаем базовый класс

Создай папку app/Http/Filters (ее нет по умолчанию) и в ней файл QueryFilter.php.
Этот класс будет отвечать за «магию»: он берет все параметры из запроса и ищет подходящие методы в фильтре.

```php
<?php

namespace App\Http\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

abstract class QueryFilter
{
    protected $request;
    protected $builder;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    // Главный метод: применяет фильтры к запросчику (Builder)
    public function apply(Builder $builder)
    {
        $this->builder = $builder;

        // Пробегаем по всем параметрам из URL (search, min_price...)
        foreach ($this->filters() as $name => $value) {
            // Если в классе есть метод с таким именем (например, min_price) — вызываем его
            if (method_exists($this, $name)) {
                call_user_func_array([$this, $name], array_filter([$value]));
            }
        }

        return $this->builder;
    }

    // Получаем все параметры из запроса
    public function filters()
    {
        return $this->request->all();
    }
}
```

### Шаг 2. Создаем фильтр для продуктов

Теперь создай файл app/Http/Filters/ProductFilter.php. Сюда мы перенесем логику из твоего контроллера.
Обрати внимание: названия методов совпадают с названиями параметров в URL (search, min_price, max_price).

```php
<?php

namespace App\Http\Filters;

class ProductFilter extends QueryFilter
{
    // ?search=iphone
    public function search($search = '')
    {
        return $this->builder->where('name', 'like', '%' . $search . '%');
    }

    // ?min_price=100
    public function min_price($price)
    {
        return $this->builder->where('price', '>=', $price);
    }

    // ?max_price=500
    public function max_price($price)
    {
        return $this->builder->where('price', '<=', $price);
    }
}
```

### Шаг 3. Учим модель использовать фильтр
Открой свою модель App\Models\Product.php. Нам нужно добавить туда метод scopeFilter.
Laravel использует концепцию Scope (Заготовки запросов). Если назвать метод scopeName, его можно вызывать как Product::
name().

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder; // Не забудь добавить импорт
use App\Http\Filters\QueryFilter; // И наш базовый класс

class Product extends Model
{
    // ... твои свойства ($table, $fillable, $casts) ...

    /**
     * Магический скоуп для применения фильтров
     */
    public function scopeFilter(Builder $builder, QueryFilter $filter)
    {
        return $filter->apply($builder);
    }
    
    // ... твой метод img() ...
}
```


### Шаг 4. Обновляем Контроллер (Финал)
Теперь посмотри, как очистится твой CatalogController.
```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use App\Http\Filters\ProductFilter; // Импортируем наш фильтр
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Теперь метод index выглядит очень чисто
     */
    public function index(Request $request, ProductFilter $filters)
    {
        // 1. Фильтрация + Пагинация
        // Laravel сам создаст объект ProductFilter, передаст в него Request
        // А метод scopeFilter в модели вызовет ->apply()
        $paginator = Product::filter($filters)->paginate(6);

        // 2. Формируем данные (этот блок остался прежним)
        $catalogData = [
            'success' => true,
            'products' => $paginator->items(),
            'pagination' => [
                'currentPage' => $paginator->currentPage(),
                'totalPages'  => $paginator->lastPage(),
                'totalItems'  => $paginator->total()
            ]
        ];

        // 3. Данные корзины
        $cartData = $this->cartService->getCartData();

        return view('catalog.index', [
            'filters' => $request->all(), // Чтобы заполнить инпуты обратно
            'catalogData' => $catalogData,
            'cartData' => $cartData,
        ]);
    }
}
```

### Как это теперь работает (визуализация)
1. **Request**: Прилетает запрос `GET /catalog?min_price=100`.
2. **Controller**: Laravel видит ProductFilter `$filters` в аргументах и создает его (автоматически засовывая туда $request).
3. **Model**: Вызов `Product::filter($filters)` передает управление в метод apply класса QueryFilter.
4. **Filter**: Класс видит параметр min_price, находит метод min_price в ProductFilter и меняет SQL-запрос.
5. **Result**: Обратно возвращается уже отфильтрованный список.
