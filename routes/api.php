<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogApiController;
use App\Http\Controllers\Api\CartApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API маршруты для каталога
Route::prefix('catalog')->group(function () {
    Route::get('/products', [CatalogApiController::class, 'getProducts']);
});

// API маршруты для корзины
Route::prefix('cart')->group(function () {
    Route::get('/', [CartApiController::class, 'getCart']);
    Route::post('/add', [CartApiController::class, 'addToCart']);
    Route::post('/update', [CartApiController::class, 'updateCart']);
    Route::post('/remove', [CartApiController::class, 'removeFromCart']);
    Route::post('/clear', [CartApiController::class, 'clearCart']);
});

