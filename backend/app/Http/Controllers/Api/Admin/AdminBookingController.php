<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * GET /api/v1/admin/bookings
     * List all bookings with optional filters
     */
    public function index(Request $request)
    {
        $query = Booking::orderByDesc('date')->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('date')) {
            $query->whereDate('date', $request->date);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * GET /api/v1/admin/bookings/{id}
     */
    public function show(Booking $booking)
    {
        return response()->json(['success' => true, 'booking' => $booking]);
    }

    /**
     * PATCH /api/v1/admin/bookings/{id}/status
     */
    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,done,cancelled',
        ]);

        $booking->update(['status' => $request->status]);

        return response()->json(['success' => true, 'booking' => $booking]);
    }

    /**
     * GET /api/v1/admin/bookings/stats
     * Summary counts for dashboard
     */
    public function stats()
    {
        $today   = now()->toDateString();
        $weekStart = now()->startOfWeek()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        return response()->json([
            'success' => true,
            'stats'   => [
                'today'        => Booking::whereDate('date', $today)->count(),
                'this_week'    => Booking::whereDate('date', '>=', $weekStart)->count(),
                'this_month'   => Booking::whereDate('date', '>=', $monthStart)->count(),
                'pending'      => Booking::where('status', 'pending')->count(),
                'confirmed'    => Booking::where('status', 'confirmed')->count(),
                'total'        => Booking::count(),
            ],
        ]);
    }
}
