<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminArticleController extends Controller
{
    /**
     * GET /api/v1/admin/articles
     */
    public function index()
    {
        $articles = Article::orderByDesc('created_at')
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'is_published', 'published_at', 'sort_order', 'created_at')
            ->paginate(20);

        return response()->json($articles);
    }

    /**
     * GET /api/v1/admin/articles/{id}
     */
    public function show(Article $article)
    {
        return response()->json(['success' => true, 'article' => $article]);
    }

    /**
     * POST /api/v1/admin/articles
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'slug'         => 'nullable|string|unique:articles,slug',
            'excerpt'      => 'nullable|string|max:500',
            'content'      => 'required|string',
            'cover_image'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);

        // Generate slug if not provided
        $data['slug'] = $data['slug'] ?? Article::generateSlug($data['title']);

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('articles', 'public');
            $data['cover_image'] = Storage::url($path);
        }

        // Set published_at when publishing
        if (!empty($data['is_published'])) {
            $data['published_at'] = now();
        }

        $article = Article::create($data);

        return response()->json(['success' => true, 'article' => $article], 201);
    }

    /**
     * PUT /api/v1/admin/articles/{id}
     */
    public function update(Request $request, Article $article)
    {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'slug'         => 'nullable|string|unique:articles,slug,' . $article->id,
            'excerpt'      => 'nullable|string|max:500',
            'content'      => 'sometimes|string',
            'cover_image'  => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'is_published' => 'nullable|boolean',
            'sort_order'   => 'nullable|integer',
        ]);

        // Auto slug from new title if title changed and no slug given
        if (isset($data['title']) && !isset($data['slug'])) {
            $data['slug'] = Article::generateSlug($data['title'], $article->id);
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($article->cover_image) {
                $old = str_replace('/storage/', '', $article->cover_image);
                Storage::disk('public')->delete($old);
            }
            $path = $request->file('cover_image')->store('articles', 'public');
            $data['cover_image'] = Storage::url($path);
        }

        // Set published_at when first publishing
        if (!empty($data['is_published']) && !$article->is_published) {
            $data['published_at'] = now();
        }

        $article->update($data);

        return response()->json(['success' => true, 'article' => $article]);
    }

    /**
     * DELETE /api/v1/admin/articles/{id}
     */
    public function destroy(Article $article)
    {
        // Delete cover image
        if ($article->cover_image) {
            $path = str_replace('/storage/', '', $article->cover_image);
            Storage::disk('public')->delete($path);
        }

        $article->delete();

        return response()->json(['success' => true, 'message' => 'Artikel dihapus.']);
    }
}
