<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\PortfolioController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => response()->json(['status' => 'ok']));

Route::controller(PortfolioController::class)->group(function () {
    Route::get('/profile', 'profile');
    Route::get('/academics', 'academics');
    Route::get('/timeline', 'timeline');
    Route::get('/services', 'services');
    Route::get('/skills', 'skills');
    Route::get('/projects', 'projects');
    Route::get('/experiences', 'experiences');
    Route::get('/certificates', 'certificates');
});

// 5 messages per 10 minutes per visitor.
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,10');
