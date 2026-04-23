<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminServiceController;
use App\Http\Controllers\Api\Admin\AdminGalleryController;
use App\Http\Controllers\Api\Admin\AdminTestimonialController;
use App\Http\Controllers\Api\Admin\AdminArticleController;
use App\Http\Controllers\Api\ArticleController;
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

    // ── Health check ────────────────────────────────────────────────
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'app' => 'Kokuro Beauty Space API']));

    // ── Public: Services & Pricelist ────────────────────────────────
    Route::get('/services',  [ServiceController::class, 'index']);
    Route::get('/pricelist', [ServiceController::class, 'pricelist']);

    // ── Public: Bookings (customer submit) ──────────────────────────
    Route::post('/bookings', [BookingController::class, 'store']);

    // ── Public: Testimonials ────────────────────────────────────────
    Route::get('/testimonials', [TestimonialController::class, 'index']);

    // ── Public: Gallery ─────────────────────────────────────────────
    Route::get('/gallery', [GalleryController::class, 'index']);

    // ── Public: Articles (Blog) ─────────────────────────────────────
    Route::get('/articles/latest', [ArticleController::class, 'latest']);
    Route::get('/articles',        [ArticleController::class, 'index']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);

    // ── Admin: Auth (no guard) ──────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::post('/login', [AdminAuthController::class, 'login']);

        // Protected by Sanctum token
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AdminAuthController::class, 'logout']);
            Route::get('/me',     [AdminAuthController::class, 'me']);

            // Bookings management
            Route::get('/bookings',              [AdminBookingController::class, 'index']);
            Route::get('/bookings/stats',        [AdminBookingController::class, 'stats']);
            Route::get('/bookings/{booking}',    [AdminBookingController::class, 'show']);
            Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus']);

            // Services management
            Route::post('/services',           [AdminServiceController::class, 'store']);
            Route::patch('/services/{service}', [AdminServiceController::class, 'update']);
            Route::delete('/services/{service}', [AdminServiceController::class, 'destroy']);

            // Gallery management
            Route::post('/gallery',            [AdminGalleryController::class, 'store']);
            Route::patch('/gallery/{gallery}',  [AdminGalleryController::class, 'update']);
            Route::delete('/gallery/{gallery}', [AdminGalleryController::class, 'destroy']);

            // Testimonials management
            Route::post('/testimonials',                [AdminTestimonialController::class, 'store']);
            Route::patch('/testimonials/{testimonial}', [AdminTestimonialController::class, 'update']);
            Route::delete('/testimonials/{testimonial}', [AdminTestimonialController::class, 'destroy']);

            // Articles management
            Route::get('/articles',            [AdminArticleController::class, 'index']);
            Route::post('/articles',           [AdminArticleController::class, 'store']);
            Route::get('/articles/{article}',  [AdminArticleController::class, 'show']);
            Route::post('/articles/{article}', [AdminArticleController::class, 'update']); // POST for multipart/form-data with _method=PUT
            Route::delete('/articles/{article}', [AdminArticleController::class, 'destroy']);
        });
    });
});
