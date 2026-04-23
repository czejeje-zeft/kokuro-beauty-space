<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class AdminTestimonialController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'          => 'required|string|max:255',
            'service_type'  => 'required|string|max:100',
            'avatar_letter' => 'required|string|max:1',
            'text'          => 'required|string',
            'rating'        => 'nullable|integer|min:1|max:5',
            'sort_order'    => 'nullable|integer',
            'is_active'     => 'nullable|boolean',
        ]);

        $testimonial = Testimonial::create($data);

        return response()->json(['success' => true, 'testimonial' => $testimonial], 201);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $data = $request->validate([
            'name'          => 'sometimes|string|max:255',
            'service_type'  => 'sometimes|string|max:100',
            'avatar_letter' => 'sometimes|string|max:1',
            'text'          => 'sometimes|string',
            'rating'        => 'nullable|integer|min:1|max:5',
            'sort_order'    => 'nullable|integer',
            'is_active'     => 'nullable|boolean',
        ]);

        $testimonial->update($data);

        return response()->json(['success' => true, 'testimonial' => $testimonial]);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();

        return response()->json(['success' => true, 'message' => 'Testimoni dihapus.']);
    }
}
