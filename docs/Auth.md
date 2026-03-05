# Аутентификация: Fortify + Sanctum

## Оглавление

1. [Архитектура](#1-архитектура)
2. [Как работает Fortify](#2-как-работает-fortify)
3. [Как работает Sanctum](#3-как-работает-sanctum)
4. [Все эндпоинты](#4-все-эндпоинты)
5. [Страница Login](#5-страница-login)
6. [Страница Register](#6-страница-register)
7. [Email Verification](#7-email-verification)
8. [Сброс пароля](#8-сброс-пароля)
9. [Двухфакторная аутентификация (2FA)](#9-двухфакторная-аутентификация-2fa)
10. [Защита роутов (Middleware)](#10-защита-роутов-middleware)
11. [Использование из React (SPA)](#11-использование-из-react-spa)
12. [Конфигурационные файлы](#12-конфигурационные-файлы)

---

## 1. Архитектура

```
Браузер/React
    │
    │  POST /login, POST /register ...
    ▼
Laravel Fortify          — регистрирует эндпоинты, проверяет пароль, создаёт сессию
    │
    ▼
Laravel Sanctum          — охраняет API-роуты через сессионную куку
    │
    ▼
auth:sanctum middleware  — пускает только авторизованных
```

**В этом проекте:**
- Публичные страницы — Blade (SSR)
- Личный кабинет — Blade-оболочка + React внутри
- Авторизация — Fortify ставит сессионную куку, Sanctum читает её при API-запросах

---

## 2. Как работает Fortify

Fortify — **backend-only** пакет. Он не рендерит UI, но:

1. **Автоматически регистрирует роуты** (login, logout, register, password reset и др.)
2. **Определяет логику** через Action-классы в `app/Actions/Fortify/`
3. **Возвращает вьюхи** через колбэки, прописанные в `FortifyServiceProvider`

Сами роуты Fortify регистрирует в своём `vendor/laravel/fortify/src/FortifyServiceProvider.php` — туда лезть не нужно.

Ваши точки настройки:

| Файл | Что настраивается |
|---|---|
| `config/fortify.php` | фичи, редиректы, guard, prefix |
| `app/Providers/FortifyServiceProvider.php` | вьюхи, rate limiting |
| `app/Actions/Fortify/` | логика создания/обновления пользователей |

---

## 3. Как работает Sanctum

Sanctum добавляет `auth:sanctum` middleware, который умеет авторизовать через **два метода**:

| Метод | Когда используется |
|---|---|
| **Session cookie** | Браузер / SPA на том же домене |
| **Bearer Token** | Мобильные приложения / сторонние клиенты |

В этом проекте используется **session cookie**. После `POST /login` браузер получает куку `laravel_session`, и все дальнейшие запросы к API авторизуются автоматически.

Настройки в `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1'
)),
```
Сюда нужно добавить продакшн-домен через `.env`:
```
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

---

## 4. Все эндпоинты

Fortify регистрирует следующие роуты автоматически (при включённых фичах):

| Метод | URL | Описание | Нужная фича |
|---|---|---|---|
| `GET` | `/login` | Страница входа | всегда |
| `POST` | `/login` | Обработка входа | всегда |
| `POST` | `/logout` | Выход | всегда |
| `GET` | `/register` | Страница регистрации | `registration()` |
| `POST` | `/register` | Обработка регистрации | `registration()` |
| `GET` | `/forgot-password` | Форма запроса сброса | `resetPasswords()` |
| `POST` | `/forgot-password` | Отправить ссылку на email | `resetPasswords()` |
| `GET` | `/reset-password/{token}` | Форма нового пароля | `resetPasswords()` |
| `POST` | `/reset-password` | Сохранить новый пароль | `resetPasswords()` |
| `GET` | `/email/verify` | Страница «подтвердите email» | `emailVerification()` |
| `GET` | `/email/verify/{id}/{hash}` | Обработка ссылки из письма | `emailVerification()` |
| `POST` | `/email/verification-notification` | Переотправить письмо | `emailVerification()` |
| `GET` | `/two-factor-challenge` | Страница ввода кода 2FA | `twoFactorAuthentication()` |
| `POST` | `/two-factor-challenge` | Проверить код 2FA | `twoFactorAuthentication()` |
| `POST` | `/user/two-factor-authentication` | Включить 2FA | `twoFactorAuthentication()` |
| `DELETE` | `/user/two-factor-authentication` | Отключить 2FA | `twoFactorAuthentication()` |
| `GET` | `/user/two-factor-qr-code` | QR-код для приложения | `twoFactorAuthentication()` |
| `GET` | `/user/two-factor-recovery-codes` | Резервные коды | `twoFactorAuthentication()` |
| `POST` | `/user/two-factor-recovery-codes` | Сгенерировать новые коды | `twoFactorAuthentication()` |

Посмотреть все зарегистрированные роуты:
```bash
php artisan route:list --name=fortify
# или просто все:
php artisan route:list
```

---

## 5. Страница Login

### Blade View

Вьюха подключается в `FortifyServiceProvider`:
```php
Fortify::loginView(fn() => view('auth.login'));
```

Файл: `resources/views/auth/login.blade.php`

Минимальная форма:
```html
<form method="POST" action="/login">
    @csrf
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <label>
        <input type="checkbox" name="remember"> Запомнить меня
    </label>
    @error('email')
        <p>{{ $message }}</p>
    @enderror
    <button type="submit">Войти</button>
</form>
```

### После успешного логина

Редирект идёт на значение `'home'` из `config/fortify.php`:
```php
'home' => '/account',  // текущее значение
```

Чтобы изменить редирект динамически (например, по роли), создайте `LoginResponse`:
```php
// app/Http/Responses/LoginResponse.php
namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = auth()->user();
        $redirectTo = $user->is_admin ? '/admin' : '/account';

        return redirect()->intended($redirectTo);
    }
}
```
Зарегистрировать в `FortifyServiceProvider::register()`:
```php
$this->app->singleton(
    \Laravel\Fortify\Contracts\LoginResponse::class,
    \App\Http\Responses\LoginResponse::class
);
```

---

## 6. Страница Register

### Включить фичу

В `config/fortify.php` раздел `features` должен содержать:
```php
Features::registration(),
```

### Blade View

```php
Fortify::registerView(fn() => view('auth.register'));
```

Файл: `resources/views/auth/register.blade.php`

Минимальная форма:
```html
<form method="POST" action="/register">
    @csrf
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <input type="password" name="password_confirmation" required>
    @if($errors->any())
        <ul>
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    @endif
    <button type="submit">Зарегистрироваться</button>
</form>
```

### Логика создания пользователя

Находится в `app/Actions/Fortify/CreateNewUser.php`. Здесь происходит валидация и создание записи в БД. Можно добавить поля или автоматически назначать роль:

```php
public function create(array $input): User
{
    Validator::make($input, [
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
        'password' => $this->passwordRules(),
    ])->validate();

    return User::create([
        'name'     => $input['name'],
        'email'    => $input['email'],
        'password' => Hash::make($input['password']),
        // 'role' => 'user',  // пример дополнительного поля
    ]);
}
```

---

## 7. Email Verification

### Включить фичу

В `config/fortify.php`:
```php
// Features::emailVerification(),  // раскомментировать
```

### Что нужно

1. В таблице `users` должна быть колонка `email_verified_at` (уже есть в миграции).
2. Модель `User` должна реализовывать интерфейс:
```php
// app/Models/User.php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
```

3. Добавить вьюху в `FortifyServiceProvider`:
```php
Fortify::verifyEmailView(fn() => view('auth.verify-email'));
```

4. Файл `resources/views/auth/verify-email.blade.php`:
```html
<p>Мы отправили письмо на {{ auth()->user()->email }}.</p>
<form method="POST" action="/email/verification-notification">
    @csrf
    <button type="submit">Отправить письмо повторно</button>
</form>
```

5. Настроить SMTP в `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=no-reply@example.com
```

### Защита роутов только для верифицированных

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/account', ...);
});
```
Именно так уже настроен `/account` в `routes/web.php`.

---

## 8. Сброс пароля

### Включить фичу

```php
Features::resetPasswords(),  // уже включено
```

### Blade Views

```php
// FortifyServiceProvider
Fortify::requestPasswordResetLinkView(fn() => view('auth.forgot-password'));
Fortify::resetPasswordView(fn($request) => view('auth.reset-password', [
    'request' => $request
]));
```

`resources/views/auth/forgot-password.blade.php`:
```html
<form method="POST" action="/forgot-password">
    @csrf
    <input type="email" name="email" required>
    @if(session('status'))
        <p>{{ session('status') }}</p>
    @endif
    <button type="submit">Отправить ссылку</button>
</form>
```

`resources/views/auth/reset-password.blade.php`:
```html
<form method="POST" action="/reset-password">
    @csrf
    <input type="hidden" name="token" value="{{ $request->route('token') }}">
    <input type="email" name="email" value="{{ $request->email }}" required>
    <input type="password" name="password" required>
    <input type="password" name="password_confirmation" required>
    <button type="submit">Сохранить пароль</button>
</form>
```

### Логика

Находится в `app/Actions/Fortify/ResetUserPassword.php`. Можно кастомизировать валидацию пароля там же.

---

## 9. Двухфакторная аутентификация (2FA)

### Статус

**Уже включено** в `config/fortify.php`:
```php
Features::twoFactorAuthentication([
    'confirm'         => true,   // подтвердить пароль перед включением
    'confirmPassword' => true,
]),
```

### Что нужно

1. В таблице `users` должны быть колонки (миграция `add_two_factor_columns_to_users_table` уже есть):
   - `two_factor_secret`
   - `two_factor_recovery_codes`
   - `two_factor_confirmed_at`

2. Модель `User` должна использовать трейт:
```php
// app/Models/User.php
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use TwoFactorAuthenticatable;
}
```

### Как включить 2FA для пользователя

Из React или Blade — сделать запрос:
```js
// 1. Включить 2FA
await axios.post('/user/two-factor-authentication');

// 2. Получить QR-код (показать пользователю, он сканирует в Google Authenticator)
const { data } = await axios.get('/user/two-factor-qr-code');
// data.svg — SVG изображение QR-кода

// 3. Подтвердить (ввести код из приложения)
await axios.post('/user/confirmed-two-factor-authentication', { code: '123456' });

// 4. Получить резервные коды
const { data } = await axios.get('/user/two-factor-recovery-codes');
```

### Страница ввода кода при входе

Когда у пользователя включён 2FA, после `/login` он редиректится на `/two-factor-challenge`.

Нужна вьюха в `FortifyServiceProvider`:
```php
Fortify::twoFactorChallengeView(fn() => view('auth.two-factor-challenge'));
```

`resources/views/auth/two-factor-challenge.blade.php`:
```html
<form method="POST" action="/two-factor-challenge">
    @csrf
    {{-- Код из приложения --}}
    <input type="text" name="code" inputmode="numeric" autocomplete="one-time-code">
    {{-- ИЛИ резервный код --}}
    <input type="text" name="recovery_code">
    <button type="submit">Подтвердить</button>
</form>
```

---

## 10. Защита роутов (Middleware)

| Middleware | Что делает |
|---|---|
| `auth` | Пускает только авторизованных, иначе → `/login` |
| `auth:sanctum` | То же самое, но через Sanctum (для API) |
| `verified` | Только с подтверждённым email |
| `guest` | Только для неавторизованных (страницы login/register) |

```php
// routes/web.php

// Только авторизованные
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
});

// Только авторизованные И верифицированные
Route::middleware(['auth', 'verified'])->group(function () {
    Route::view('/account/{path?}', 'account')->where('path', '.*');
});

// Только гости (не авторизованные)
Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => view('auth.login'));
});
```

Для API-роутов:
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user());
    Route::get('/orders', [OrderController::class, 'index']);
});
```

---

## 11. Использование из React (SPA)

При запросах из React на том же домене нужно:

### 1. Настроить axios глобально

```js
// resources/js/bootstrap.js (или axios.js)
import axios from 'axios';

axios.defaults.withCredentials = true;      // передавать куки
axios.defaults.withXSRFToken = true;        // передавать CSRF токен
axios.defaults.baseURL = window.location.origin;
```

### 2. Последовательность запросов

```js
// Шаг 1: получить CSRF-куку (обязательно перед первым POST)
await axios.get('/sanctum/csrf-cookie');

// Шаг 2: войти
await axios.post('/login', { email, password });

// Шаг 3: все следующие запросы уже авторизованы
const { data: user } = await axios.get('/api/user');
```

### 3. Проверить статус авторизации

```js
// Получить текущего пользователя
// (если 401 — не авторизован)
try {
    const { data } = await axios.get('/api/user');
    setUser(data);
} catch (e) {
    if (e.response?.status === 401) {
        // редирект на логин
    }
}
```

### 4. Выход

```js
await axios.post('/logout');
window.location.href = '/login';
```

---

## 12. Конфигурационные файлы

### `config/fortify.php`

```php
'home'     => '/account',         // куда редиректить после логина
'username' => 'email',            // поле для идентификации пользователя
'guard'    => 'web',              // используемый guard

'features' => [
    Features::registration(),                   // регистрация
    Features::resetPasswords(),                 // сброс пароля
    // Features::emailVerification(),           // верификация email (отключено)
    Features::updateProfileInformation(),       // обновление профиля
    Features::updatePasswords(),                // смена пароля
    Features::twoFactorAuthentication([...]),   // 2FA (включено)
],
```

### `config/sanctum.php`

```php
'stateful' => [...]  // домены, для которых работает session auth
'guard'    => ['web']
'expiration' => null // токены не истекают (null = бессрочно)
```

### `.env` переменные

```dotenv
# Домен для Sanctum (продакшн)
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

# Почта (для верификации и сброса пароля)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## Быстрый чеклист при добавлении нового auth-функционала

- [ ] Включить фичу в `config/fortify.php` → `features`
- [ ] Добавить вьюху в `FortifyServiceProvider::boot()` через `Fortify::xxxView()`
- [ ] Создать Blade-файл в `resources/views/auth/`
- [ ] Если нужна кастомная логика — создать/отредактировать Action в `app/Actions/Fortify/`
- [ ] Защитить роут нужным middleware
- [ ] Запустить миграции если добавилась новая фича: `php artisan migrate`
