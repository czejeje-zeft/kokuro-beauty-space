<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|in:nail,lash,presson',
            'description' => 'nullable|string',
            'price'       => 'required|integer|min:0',
            'price_label' => 'nullable|string|max:50',
            'icon'        => 'nullable|string|max:10',
            'badge'       => 'nullable|string|max:50',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        $service = Service::create($data);

        return response()->json(['success' => true, 'service' => $service], 201);
    }

    public function update(Request $request, Service $service)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'category'    => 'sometimes|in:nail,lash,presson',
            'description' => 'nullable|string',
            'price'       => 'sometimes|integer|min:0',
            'price_label' => 'nullable|string|max:50',
            'icon'        => 'nullable|string|max:10',
            'badge'       => 'nullable|string|max:50',
            'sort_order'  => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
        ]);

        $service->update($data);

        return response()->json(['success' => true, 'service' => $service]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json(['success' => true, 'message' => 'Layanan dihapus.']);
    }
}
