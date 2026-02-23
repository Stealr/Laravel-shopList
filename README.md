## Стек
- Laravel 12
- PHP 8.2
- MariaDB
- Bootstrap
- Knockout.js
- Vite (для сборки фронтенда)
- React


## Установка и запуск проекта

### Установка зависимостей и начальная настройка
Перед запуском composer run setup необходимо создать файл `.env` из `.env.example` и верно указать доступ к базе данных

Если mariadb запускается через OPanel, то вот верные настройки для `.env`:

```env
...
DB_CONNECTION=mysql
DB_HOST=MariaDB-10.4
DB_PORT=3306
DB_DATABASE=shopList
DB_USERNAME=root
DB_PASSWORD=
...
```

``` Bash
composer install
composer run setup
```
Что сделает composer run setup:
- Установит PHP-зависимости.
- Создаст файл .env из примера.
- Сгенерирует ключ приложения.
- Запустит миграции базы данных (флаг --force применит их даже в production-режиме).
- Установит JS-пакеты (npm).
- Скомпилирует фронтенд через Vite (npm run build).

### Запуск проекта (Development)
Чтобы запустить вместе сервер и Vite, используйте готовую команду:

``` Bash
composer run dev
```

Эта команда запустит одновременно:
- PHP Server: Локальный сервер на порту 8000.
- Queue: Обработчик очередей (для фоновых задач).
- Pail: Красивый вывод логов в реальном времени (новый инструмент Laravel).
- Vite: Сервер горячей перезагрузки для ваших стилей и скриптов (Bootstrap/Knockout).
