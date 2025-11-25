<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/add-user', [App\Http\Controllers\Api\AuthController::class, 'addUser']);
});

Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/check-token', [App\Http\Controllers\Api\AuthController::class, 'checkUserToken'])->middleware('auth:sanctum');