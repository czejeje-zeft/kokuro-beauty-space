<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        Service::truncate();

        $services = [
            // ── NAIL ART ──
            ['name' => 'Manicure',                      'category' => 'nail', 'description' => 'Perawatan tangan & kuku',                                  'price' => 45000,  'price_label' => 'Rp 45.000',    'icon' => '💅', 'badge' => null,      'sort_order' => 1],
            ['name' => 'Pedicure',                      'category' => 'nail', 'description' => 'Perawatan kaki & kuku',                                    'price' => 58000,  'price_label' => 'Rp 58.000',    'icon' => '💅', 'badge' => null,      'sort_order' => 2],
            ['name' => 'Nail Gel + Manicure',           'category' => 'nail', 'description' => 'Gel polish + perawatan tangan',                            'price' => 60000,  'price_label' => 'Rp 60.000',    'icon' => '💅', 'badge' => null,      'sort_order' => 3],
            ['name' => 'Nail Gel + Pedicure',           'category' => 'nail', 'description' => 'Gel polish + perawatan kaki',                              'price' => 70000,  'price_label' => 'Rp 70.000',    'icon' => '💅', 'badge' => null,      'sort_order' => 4],
            ['name' => 'Nail Extension + Gel + Manicure', 'category' => 'nail', 'description' => 'Extension lengkap + gel + perawatan',                   'price' => 140000, 'price_label' => 'Rp 140.000',   'icon' => '💅', 'badge' => 'featured','sort_order' => 5],
            // Add-ons
            ['name' => 'Sticker / Foil / Glitter',     'category' => 'nail_addon', 'description' => 'per jari',                                           'price' => 2000,   'price_label' => 'Rp 2k – 4k',   'icon' => '🎨', 'badge' => null,      'sort_order' => 6],
            ['name' => 'Chrome / Simple Art',           'category' => 'nail_addon', 'description' => 'per jari',                                           'price' => 2000,   'price_label' => 'Rp 2k – 7k',   'icon' => '🎨', 'badge' => null,      'sort_order' => 7],
            ['name' => 'Cat Eye',                       'category' => 'nail_addon', 'description' => 'per jari',                                           'price' => 3000,   'price_label' => 'Rp 3k',         'icon' => '🎨', 'badge' => null,      'sort_order' => 8],
            ['name' => 'French / Ombre / Marble',       'category' => 'nail_addon', 'description' => 'per jari',                                           'price' => 5000,   'price_label' => 'Rp 5k – 7k',   'icon' => '🎨', 'badge' => null,      'sort_order' => 9],
            ['name' => '3D / Hard Art / Character',     'category' => 'nail_addon', 'description' => 'per jari',                                           'price' => 7000,   'price_label' => 'Rp 7k – 15k',  'icon' => '🎨', 'badge' => null,      'sort_order' => 10],
            ['name' => 'Remove Nail Art',               'category' => 'nail_extra', 'description' => 'Hapus nail art (per jari)',                          'price' => 5000,   'price_label' => 'Rp 5k / jari',  'icon' => '🔧', 'badge' => null,      'sort_order' => 11],
            ['name' => 'Overlay',                       'category' => 'nail_extra', 'description' => 'Penguat / penebalan kuku',                           'price' => 15000,  'price_label' => 'Rp 15.000',    'icon' => '🔧', 'badge' => null,      'sort_order' => 12],
            // ── EYELASH ──
            ['name' => 'Single Classic Lash',           'category' => 'lash', 'description' => '1:1 natural, rapi & ringan. Efek lebih panjang tanpa terlihat tebal. Cocok untuk daily look.',      'price' => 90000,  'price_label' => 'Rp 90.000',   'icon' => '👁️', 'badge' => null,      'sort_order' => 1],
            ['name' => 'YY-Lash',                       'category' => 'lash', 'description' => 'Lebih tebal dari single classic tapi tetap natural. Efek volume ringan.',                           'price' => 120000, 'price_label' => 'Rp 120.000',  'icon' => '👁️', 'badge' => null,      'sort_order' => 2],
            ['name' => 'W-Lash',                        'category' => 'lash', 'description' => 'Lebih tebal & voluminous, tetap ringan dan rapi. Lebih bold dari single classic.',                  'price' => 160000, 'price_label' => 'Rp 160.000',  'icon' => '👁️', 'badge' => null,      'sort_order' => 3],
            ['name' => 'Hybrid Lash',                   'category' => 'lash', 'description' => 'Perpaduan natural dan tebal. Memberikan tekstur dan dimensi.',                                     'price' => 180000, 'price_label' => 'Rp 180.000',  'icon' => '👁️', 'badge' => null,      'sort_order' => 4],
            ['name' => 'Wispy Lash',                    'category' => 'lash', 'description' => 'Ringan, bertekstur, dan sedikit dramatis. Doll look atau efek K-style natural curly.',              'price' => 210000, 'price_label' => 'Rp 210.000',  'icon' => '👁️', 'badge' => 'featured','sort_order' => 5],
            // ── PRESS-ON ──
            ['name' => 'Plain Press-on',                'category' => 'presson', 'description' => 'Sudah termasuk alat pemasangan, tanpa kotak',            'price' => 35000,  'price_label' => 'Rp 35.000',   'icon' => '📦', 'badge' => null,      'sort_order' => 1],
            ['name' => 'Custom Design Press-on',        'category' => 'presson', 'description' => 'Desain custom + kotak cantik + alat pemasangan',         'price' => 45000,  'price_label' => 'Mulai Rp 45.000','icon' => '📦', 'badge' => 'featured','sort_order' => 2],
        ];

        foreach ($services as $s) {
            Service::create($s);
        }
    }
}
