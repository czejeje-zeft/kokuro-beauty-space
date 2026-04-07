<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(Gallery::where('is_active', true)->orderBy('sort_order')->get());
    }
}
