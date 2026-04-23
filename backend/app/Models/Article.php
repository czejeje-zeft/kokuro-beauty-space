<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 'slug', 'excerpt', 'content',
        'cover_image', 'is_published', 'published_at', 'sort_order',
    ];

    protected $casts = [
        'is_published'  => 'boolean',
        'published_at'  => 'datetime',
    ];

    // Scope: only published articles for public API
    public function scopePublished($query)
    {
        return $query->where('is_published', true)->orderByDesc('published_at');
    }

    // Auto-generate slug from title
    public static function generateSlug(string $title, ?int $excludeId = null): string
    {
        $base = strtolower(trim(preg_replace('/[^A-Za-z0-9\-]/', '-', str_replace(' ', '-', $title)), '-'));
        $base = preg_replace('/-+/', '-', $base);
        $slug = $base;
        $i    = 1;
        while (
            static::where('slug', $slug)
                   ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                   ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }
}
