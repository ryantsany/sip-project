<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    Route::post('/add-user', [App\Http\Controllers\Api\AuthController::class, 'addUser']);
});

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::post('/check-token', [App\Http\Controllers\Api\AuthController::class, 'checkUserToken']);
}); 

    