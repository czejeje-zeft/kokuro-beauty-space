<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\TelegramService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'phone'   => 'required|string|max:20',
            'service' => 'required|string|max:255',
            'date'    => 'required|date|after:today',
            'time'    => 'nullable|string|max:10',
            'addons'  => 'nullable|string|max:500',
            'address' => 'required|string|max:1000',
            'notes'   => 'nullable|string|max:1000',
        ]);

        $booking = Booking::create($validated);

        // ── Telegram notification (non-blocking, silent fail) ──
        try {
            (new TelegramService())->notifyNewBooking($validated);
        } catch (\Throwable) {
            // Telegram failure must never break the booking flow
        }

        // Format date to Indonesian
        $date = \Carbon\Carbon::parse($validated['date'])->locale('id')->isoFormat('dddd, D MMMM YYYY');

        // Build WhatsApp message
        $msg  = "Halo Kak Ellen! 👋\n\n";
        $msg .= "Saya ingin booking layanan di *Kokuro Beauty Space* 💅\n\n";
        $msg .= "*Nama:* {$validated['name']}\n";
        $msg .= "*No WhatsApp:* {$validated['phone']}\n";
        $msg .= "*Layanan:* {$validated['service']}\n";
        $msg .= "*Tanggal:* {$date}\n";
        $msg .= "*Waktu:* " . ($validated['time'] ?? 'Fleksibel') . " WIB\n";
        if (!empty($validated['addons'])) $msg .= "*Add-on Desain:* {$validated['addons']}\n";
        $msg .= "*Alamat:* {$validated['address']}\n";
        if (!empty($validated['notes'])) $msg .= "*Catatan:* {$validated['notes']}\n";
        $msg .= "\nApakah slot tersedia? Terima kasih! 🌸";

        $waUrl = 'https://wa.me/6283838938922?text=' . urlencode($msg);

        return response()->json([
            'success'  => true,
            'booking'  => $booking,
            'wa_url'   => $waUrl,
            'message'  => 'Booking berhasil disimpan!',
        ], 201);
    }

    public function index()
    {
        return response()->json(
            Booking::orderByDesc('created_at')->paginate(20)
        );
    }
}
