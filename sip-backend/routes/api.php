<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/first-login', [App\Http\Controllers\Api\AuthController::class, 'firstLogin']);

Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/add-user', [App\Http\Controllers\Api\ManageUserController::class, 'addUser']);
    Route::delete('/delete-user/{nomor_induk}', [App\Http\Controllers\Api\ManageUserController::class, 'deleteUser']);
    Route::get('/users', [App\Http\Controllers\Api\ManageUserController::class, 'listUsers']);
    Route::get('/search-users', [App\Http\Controllers\Api\ManageUserController::class, 'searchUsers']);
    Route::put('/update-user/{nomor_induk}', [App\Http\Controllers\Api\ManageUserController::class, 'updateUser']);

    Route::get('/borrowings', [App\Http\Controllers\Api\ManageBorrowingController::class, 'getAllBorrowings']);
    Route::post('/borrowings/{borrowing}/extend', [App\Http\Controllers\Api\ManageBorrowingController::class, 'extendBorrow']);
    Route::post('/borrowings/{borrowing}/accept', [App\Http\Controllers\Api\ManageBorrowingController::class, 'adminAcceptBorrow']);
    Route::post('/borrowings/{borrowing}/return', [App\Http\Controllers\Api\ManageBorrowingController::class, 'adminReturnBorrow']);

    Route::post('/tambah-buku', [App\Http\Controllers\Api\BookController::class, 'addNewBook']);
    Route::post('/edit-buku/{slug}', [App\Http\Controllers\Api\BookController::class, 'editBook']);
    Route::delete('/book/{slug}', [App\Http\Controllers\Api\BookController::class, 'deleteBook']);

    Route::get('/admin/dashboard/borrowings', [App\Http\Controllers\Api\BorrowController::class, 'adminDashboardBorrowings']);
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('/profile', [App\Http\Controllers\Api\AuthController::class, 'getProfile']);
    Route::post('/change-password', [App\Http\Controllers\Api\AuthController::class, 'changePassword']);

    Route::get('/books', [App\Http\Controllers\Api\BookController::class, 'getAllBooks']);
    Route::get('/books/{slug}', [App\Http\Controllers\Api\BookController::class, 'getBookDetails']);
    Route::get('/search-books', [App\Http\Controllers\Api\BookController::class, 'searchBooks']);
    Route::get('/books-latest', [App\Http\Controllers\Api\BookController::class, 'getFourLatestBooks']);


    Route::post('/pinjam-buku', [App\Http\Controllers\Api\BorrowController::class, 'borrowBook']);
    Route::get('/pinjam-buku', [App\Http\Controllers\Api\BorrowController::class, 'getUserBorrowings']);

    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'getUserNotifications']);
});
