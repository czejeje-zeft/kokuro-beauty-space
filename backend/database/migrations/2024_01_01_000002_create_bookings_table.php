<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('service');
            $table->date('date');
            $table->string('time')->nullable();
            $table->string('addons')->nullable();
            $table->text('address');
            $table->text('notes')->nullable();
            $table->string('status')->default('pending'); // pending | confirmed | done | cancelled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
