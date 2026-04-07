<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        Gallery::truncate();

        $items = [
            ['title' => 'Nail Art Design 1',     'category' => 'nail',    'image_url' => '/images/nail-hero.png',    'alt' => 'Nail Art Design 1',    'sort_order' => 1],
            ['title' => 'Eyelash Extension',      'category' => 'lash',    'image_url' => '/images/lash-service.png', 'alt' => 'Eyelash Extension',    'sort_order' => 2],
            ['title' => 'Press-on Nails',         'category' => 'presson', 'image_url' => '/images/press-on.png',     'alt' => 'Press-on Nails',       'sort_order' => 3],
            ['title' => 'Nail Art Design 2',      'category' => 'nail',    'image_url' => '/images/nail-hero.png',    'alt' => 'Nail Art Design 2',    'sort_order' => 4],
            ['title' => 'Wispy Lash',             'category' => 'lash',    'image_url' => '/images/lash-service.png', 'alt' => 'Wispy Lash',           'sort_order' => 5],
            ['title' => 'Custom Press-on',        'category' => 'presson', 'image_url' => '/images/press-on.png',     'alt' => 'Custom Press-on Nails','sort_order' => 6],
        ];

        foreach ($items as $item) {
            Gallery::create($item);
        }
    }
}
