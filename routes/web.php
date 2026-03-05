<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return view('mainPage');
});

// Маршруты для отображения страниц (только GET)
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');

// API маршруты для корзины (в web для сохранения сессии)
Route::prefix('api/cart')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\CartApiController::class, 'getCart']);
    Route::post('/add', [\App\Http\Controllers\Api\CartApiController::class, 'addToCart']);
    Route::post('/update', [\App\Http\Controllers\Api\CartApiController::class, 'updateCart']);
    Route::post('/remove', [\App\Http\Controllers\Api\CartApiController::class, 'removeFromCart']);
    Route::post('/clear', [\App\Http\Controllers\Api\CartApiController::class, 'clearCart']);
});

// Личный кабинет — защищён middleware auth
Route::view('/account/{path?}', 'account')
    ->middleware(['auth', 'verified'])
    ->where('path', '.*')
    ->name('account');
