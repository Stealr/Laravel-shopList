## Blade-компоненты
Компоненты — это кастомные HTML-теги (например, <x-button>), которые инкапсулируют в себе верстку и логику. В Laravel 12 они разделены на два типа: анонимные и классовые.

### 1. Анонимные компоненты (Anonymous)
Это просто Blade-файлы. Идеальны для простых UI-элементов (кнопки, модалки, иконки).

Где хранятся:
Все файлы должны лежать в resources/views/components/.

Пример создания (resources/views/components/button.blade.php):
```bladehtml
{{-- Принимаем входящие данные --}}
@props(['type' => 'button', 'color' => 'blue'])

<button type="{{ $type }}" {{ $attributes->merge(['class' => "btn btn-{$color}"]) }}>
{{ $slot }}
</button>
```

Разбор синтаксиса:
- @props: Определяет переменные, которые компонент ждет «снаружи». Можно задать значения по умолчанию.
- $slot: Сюда попадает всё содержимое, которое вы поместите между тегами <x-button>...</x-button>.
- $attributes: Содержит все атрибуты, не указанные в @props (например, id, onclick, data-id).
- merge(): Умное слияние классов. Позволяет добавить классы к дефолтным прямо при вызове компонента.

Как вызвать:
```bladehtml
<x-button type="submit" color="green" class="mt-4">
Сохранить
</x-button>
```

### 2. Компоненты на классах (Class-based)
Это связка PHP-класса и Blade-шаблона. Это решение вашей задачи с корзиной в хедере.

В старом подходе через @include('partials.header') вам приходилось передавать $cartCount из каждого контроллера. Забыли в одном — получили ошибку Undefined variable.
Классовый компонент сам «добывает» свои данные.

**Как создать:**  
Запустите команду: `php artisan make:component Header`

Логика: `app/View/Components/Header.php`  
Шаблон: `resources/views/components/header.blade.php`

Пример реализации корзины:
Класс (Header.php):

```php
namespace App\View\Components;

use Illuminate\View\Component;
use App\Services\CartService;

class Header extends Component
{
public $cartCount;

    public function __construct(CartService $cart)
    {
        // Логика выполняется автоматически при рендеринге компонента
        $this->cartCount = $cart->getCount();
    }

    public function render()
    {
        return view('components.header');
    }
}
```

Шаблон (header.blade.php):
```bladehtml
<header>
    <nav>...</nav>
    <div class="cart">🛒 Товаров: {{ $cartCount }}</div>
</header>
Как использовать:
Просто вставьте тег в ваш основной Layout. Контроллеры страниц больше не должны ничего знать о корзине.

Blade
<x-header />
```

| Особенность | Анонимные компоненты | Классовые компоненты |
| :--- | :--- | :--- |
| **Файлы** | Только `.blade.php` | `.php` (класс) + `.blade.php` |
| **Где логика?** | Внутри Blade (минимальная) | В методе `__construct` |
| **Для чего?** | UI, дизайн, кнопки | Шапка, сайдбар, сложные виджеты |
| **Доступ к БД?** | Нет (не рекомендуется) | Да, через Dependency Injection |


### Продвинутые фишки
Вложенные папки
Если компонент лежит в `resources/views/components/forms/input.blade.php`, вызывайте его через точку:
`<x-forms.input />`

Именованные слоты  
Если у вас в компоненте несколько мест для вставки текста (например, в модалке есть заголовок и тело):

В компоненте:
```bladehtml
<div class="modal">
    <div class="title">{{ $title }}</div>
    <div class="body">{{ $slot }}</div>
</div>
```

При вызове:
```bladehtml
<x-modal>
<x-slot:title>Внимание!</x-slot:title>
Это основное содержимое окна.
</x-modal>
```
