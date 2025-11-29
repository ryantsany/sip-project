<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/first-login', [App\Http\Controllers\Api\AuthController::class, 'firstLogin']);

Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/add-user', [App\Http\Controllers\Api\AuthController::class, 'addUser']);
    Route::post('/tambah-buku', [App\Http\Controllers\Api\BookController::class, 'addNewBook']);
    Route::post('/edit-buku/{slug}', [App\Http\Controllers\Api\BookController::class, 'editBook']);
    Route::delete('/book/{slug}', [App\Http\Controllers\Api\BookController::class, 'deleteBook']);
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/profile', [App\Http\Controllers\Api\AuthController::class, 'getProfile']);

    Route::get('/books', [App\Http\Controllers\Api\BookController::class, 'getAllBooks']);
    Route::get('/books/{slug}', [App\Http\Controllers\Api\BookController::class, 'getBookDetails']);
    Route::get('/search-books', [App\Http\Controllers\Api\BookController::class, 'searchBooks']);


    Route::post('/pinjam-buku', [App\Http\Controllers\Api\BorrowController::class, 'borrowBook']);
    Route::get('/pinjam-buku', [App\Http\Controllers\Api\BorrowController::class, 'getUserBorrowings']);

    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'getUserNotifications']);
}); 

    