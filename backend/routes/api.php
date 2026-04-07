<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Kokuro Beauty Space – API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Services & Pricelist
    Route::get('/services',  [ServiceController::class, 'index']);
    Route::get('/pricelist', [ServiceController::class, 'pricelist']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings',  [BookingController::class, 'index']);

    // Testimonials
    Route::get('/testimonials', [TestimonialController::class, 'index']);

    // Gallery
    Route::get('/gallery', [GalleryController::class, 'index']);

    // Health check
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'Kokuro Beauty Space API']));
});
