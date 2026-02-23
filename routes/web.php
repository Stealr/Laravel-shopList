<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CartController;

Route::get('/', function () {
    return view('shopList.mainPage');
});

// Маршруты для отображения страниц (только GET)
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
