<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminGalleryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image'      => 'required|image|mimes:jpeg,png,jpg,webp|max:4096',
            'title'      => 'required|string|max:255',
            'category'   => 'required|in:nail,lash,presson',
            'alt'        => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        // Store image in public disk
        $path = $request->file('image')->store('gallery', 'public');

        $gallery = Gallery::create([
            'title'      => $request->title,
            'category'   => $request->category,
            'image_url'  => Storage::url($path),
            'alt'        => $request->alt ?? $request->title,
            'sort_order' => $request->sort_order ?? 0,
            'is_active'  => true,
        ]);

        return response()->json(['success' => true, 'gallery' => $gallery], 201);
    }

    public function update(Request $request, Gallery $gallery)
    {
        $data = $request->validate([
            'title'      => 'sometimes|string|max:255',
            'category'   => 'sometimes|in:nail,lash,presson',
            'alt'        => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'nullable|boolean',
        ]);

        $gallery->update($data);

        return response()->json(['success' => true, 'gallery' => $gallery]);
    }

    public function destroy(Gallery $gallery)
    {
        // Delete physical file
        $relativePath = str_replace('/storage/', '', $gallery->image_url);
        Storage::disk('public')->delete($relativePath);

        $gallery->delete();

        return response()->json(['success' => true, 'message' => 'Foto dihapus.']);
    }
}
