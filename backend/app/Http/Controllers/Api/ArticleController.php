<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;

class ArticleController extends Controller
{
    /**
     * GET /api/v1/articles
     * Public: list published articles
     */
    public function index()
    {
        $articles = Article::published()
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at')
            ->paginate(12);

        return response()->json($articles);
    }

    /**
     * GET /api/v1/articles/{slug}
     * Public: single article by slug
     */
    public function show(string $slug)
    {
        $article = Article::published()
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json(['success' => true, 'article' => $article]);
    }

    /**
     * GET /api/v1/articles/latest
     * Public: get latest 3 for landing page section
     */
    public function latest()
    {
        $articles = Article::published()
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at')
            ->limit(3)
            ->get();

        return response()->json(['success' => true, 'articles' => $articles]);
    }
}
