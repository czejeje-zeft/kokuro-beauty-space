<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        Testimonial::truncate();

        $testimonials = [
            ['name' => 'Anisa R.',   'service_type' => 'Pelanggan Nail Art',    'avatar_letter' => 'A', 'text' => '"Hasilnya bagus banget! Kukuku jadi cantik dan rapi. Ellen orangnya ramah, sabar, dan teliti banget. Pasti balik lagi! 💅"',                                       'rating' => 5, 'sort_order' => 1],
            ['name' => 'Siti N.',    'service_type' => 'Pelanggan Eyelash',     'avatar_letter' => 'S', 'text' => '"Bulu matanya natural banget, cocok buat daily pakai. Harganya worth it apalagi home service, gak perlu keluar rumah!"',                                        'rating' => 5, 'sort_order' => 2],
            ['name' => 'Dina K.',    'service_type' => 'Pelanggan Press-on',    'avatar_letter' => 'D', 'text' => '"Press-on nails-nya keren banget! Custom sesuai request, packagingnya lucu. Recommended untuk yang mau nails cantik tapi gak sempat salon!"',                   'rating' => 5, 'sort_order' => 3],
            ['name' => 'Rina P.',    'service_type' => 'Pelanggan Eyelash',     'avatar_letter' => 'R', 'text' => '"Wispy lash-nya bagus dan tahan lama! Sudah 3 minggu masih oke. Ellen juga fast respon dan jadwalnya bisa disesuaikan. 10/10!"',                                'rating' => 5, 'sort_order' => 4],
            ['name' => 'Mega F.',    'service_type' => 'Pelanggan Nail 3D Art', 'avatar_letter' => 'M', 'text' => '"Nail art dengan 3D design pernikahan, hasilnya melebihi ekspektasi! Detailnya rapi sekali. Semua tamu pujian terus sama kukuku 🥰"',                           'rating' => 5, 'sort_order' => 5],
        ];

        foreach ($testimonials as $t) {
            Testimonial::create($t);
        }
    }
}
