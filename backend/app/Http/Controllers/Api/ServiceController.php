<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::orderBy('sort_order')->get());
    }

    public function pricelist()
    {
        return response()->json(Service::orderBy('category')->orderBy('sort_order')->get());
    }
}
