## Controller

Этот контроллер — отличный пример классического подхода в Laravel. Давай разберем «механику» его работы, не углубляясь в
то, как именно фильтруются товары.

### Как работает этот контроллер?

Контроллер в Laravel — это «дирижер». Он получает запрос, вызывает нужные службы (Services) или модели (Models) и в
конце возвращает ответ (View или JSON).

Магия конструктора (__construct)

```PHP
public function __construct(CartService $cartService) {
    $this->cartService = $cartService;
}
```

Здесь работает Внедрение зависимостей (Dependency Injection). Тебе не нужно писать $this->cartService = new
CartService(). Laravel сам видит тип CartService, создает этот объект и «подсовывает» его в контроллер. Это делает код
гибким и удобным для тестирования.

Метод index(Request $request)
Когда пользователь заходит на /catalog, Laravel вызывает этот метод.
- Request $request — Laravel автоматически передает сюда объект со всеми данными от пользователя.
- Результат — в конце метод возвращает view(). Это команда Laravel: «Возьми этот шаблон, заполни его этими данными и отдай
пользователю чистый HTML».

### Что лежит в $request?
Объект $request — это «посылка» от браузера. В нем лежит абсолютно всё, что пришло с фронтенда:
1. Данные из URL (Query string): Если ссылка выглядит как catalog?search=iphone&min_price=500, то в $request будут эти
значения
2. Данные форм: Всё, что пользователь ввел в поля `<input>`
3. Служебная информация:
   - Метод: GET, POST, PUT и т.д.
   - IP-адрес пользователя.
   - User-Agent: какой браузер и ОС у человека.
   - Cookies и Заголовки (Headers).
   - Файлы: если пользователь загружает картинку, она тоже будет в $request.

Методы Request:
- $request->input('search') — достает конкретное значение.
- $request->all() — превращает все входящие данные в массив.
- $request->has('search') — проверяет, прислал ли пользователь это поле.
- $request->query('search') — достает данные только из URL, игнорируя формы.
- $request->file('avatar') — работает с загруженными файлами.
- $request->ip() — возвращает IP-адрес пользователя.
- $request->userAgent() — возвращает строку с информацией о браузере и ОС.
- $request->method() — возвращает HTTP-метод (GET, POST и т.д.).
- $request->header('Authorization') — достает конкретный заголовок из запроса.
- $request->cookie('session_id') — работает с куки.
- $request->is('admin/*') — проверяет, соответствует ли URL определенному шаблону.
- $request->ajax() — проверяет, был ли запрос сделан через AJAX.
- $request->validate() — позволяет быстро проверить данные на валидность
- и тд.


### Route Model Binding (Связывание с моделью)
Если маршрут для одного товара /catalog/{product}, тебе не нужно было бы писать Product::find($id). Ты
просто указываешь модель в аргументах:

```php
public function show(Product $product) {
    return view('product.show', compact('product'));
}
```
Laravel сам найдет товар в базе по ID из ссылки. Если не найдет — выдаст 404.

### Middleware (Посредники)
Ты можешь прямо в контроллере указать, кому можно им пользоваться:
```php
public function __construct() {
    $this->middleware('auth'); // Только для залогиненных
    $this->middleware('log.requests')->only('index'); // Логировать только главную
}
```

### Single Action Controllers (Контроллер одного действия)
Если контроллер делает только одну вещь (например, только показывает каталог), можно использовать магический метод `__
invoke()`

```php
class CatalogController extends Controller {
    public function __invoke(Request $request) {
        // Логика тут
    }
}
// В маршрутах тогда пишем просто: Route::get('/catalog', CatalogController::class);
```

В таком случае из web.php вызов такого класса: `Route::get('/catalog', CatalogController::class);`. Без указания метода, который необходимо вызвать в классе.
