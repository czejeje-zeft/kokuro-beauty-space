<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private string $token;
    private string $chatId;

    public function __construct()
    {
        $this->token  = config('services.telegram.bot_token', '');
        $this->chatId = config('services.telegram.chat_id', '');
    }

    /**
     * Send a plain text message to the configured Telegram chat.
     */
    public function send(string $message): bool
    {
        if (empty($this->token) || empty($this->chatId)) {
            Log::warning('[Telegram] Bot token or chat_id not configured.');
            return false;
        }

        try {
            $response = Http::timeout(5)->post(
                "https://api.telegram.org/bot{$this->token}/sendMessage",
                [
                    'chat_id'    => $this->chatId,
                    'text'       => $message,
                    'parse_mode' => 'HTML',
                ]
            );

            if (!$response->successful()) {
                Log::error('[Telegram] Send failed: ' . $response->body());
                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('[Telegram] Exception: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a booking notification to Ellen.
     */
    public function notifyNewBooking(array $booking): bool
    {
        $date   = \Carbon\Carbon::parse($booking['date'])
            ->locale('id')
            ->isoFormat('dddd, D MMMM YYYY');

        $message  = "🔔 <b>BOOKING BARU MASUK!</b>\n\n";
        $message .= "👤 <b>Nama:</b> {$booking['name']}\n";
        $message .= "📱 <b>WhatsApp:</b> {$booking['phone']}\n";
        $message .= "💅 <b>Layanan:</b> {$booking['service']}\n";
        if (!empty($booking['addons']))
            $message .= "✨ <b>Add-on:</b> {$booking['addons']}\n";
        $message .= "📅 <b>Tanggal:</b> {$date}\n";
        $message .= "🕐 <b>Waktu:</b> " . ($booking['time'] ?? 'Fleksibel') . " WIB\n";
        $message .= "📍 <b>Alamat:</b> {$booking['address']}\n";
        if (!empty($booking['notes']))
            $message .= "📝 <b>Catatan:</b> {$booking['notes']}\n";
        $message .= "\n<a href=\"https://wa.me/" . ltrim(preg_replace('/\D/', '', $booking['phone']), '0') . "\">💬 Balas via WhatsApp</a>";

        return $this->send($message);
    }
}
