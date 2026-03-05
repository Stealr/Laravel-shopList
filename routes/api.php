<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API маршруты для каталога
Route::prefix('catalog')->group(function () {
    Route::get('/products', [CatalogApiController::class, 'getProducts']);
});


// Здесь будут другие API маршруты для личного кабинета
