<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin user (Ellen) ─────────────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@kokurobeauty.com'],
            [
                'name'     => 'Ellen Amelia',
                'email'    => 'admin@kokurobeauty.com',
                'password' => Hash::make('kokuro2026!'),
            ]
        );

        // ── Content seeders ────────────────────────────────────────
        $this->call([
            ServiceSeeder::class,
            TestimonialSeeder::class,
            GallerySeeder::class,
        ]);
    }
}
