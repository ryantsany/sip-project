<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Notification;
use App\ResponseFormatter;
use Illuminate\Http\Request;

class BorrowController extends Controller
{
    public function borrowBook(Request $request)
    {
        // Check if the user has reached the borrowing limit
        $countUserBorrowings = Borrowing::where('user_id', $request->user()->id)
            ->whereIn('status', ['Pending', 'Dipinjam', 'Terlambat'])
            ->count();
        if ($countUserBorrowings >= 3) {
            return ResponseFormatter::error(400, null, 'Anda telah mencapai batas maksimal peminjaman buku (3 buku sekaligus). Silahkan kembalikan buku yang sedang dipinjam sebelum meminjam buku lain.');
        }

        // Check if the user has any late borrowings
        $hasLateBorrowings = Borrowing::where('user_id', $request->user()->id)
            ->where('status', 'Terlambat')
            ->exists();
        if ($hasLateBorrowings) {
            return ResponseFormatter::error(400, null, 'Anda memiliki peminjaman yang terlambat. Silahkan selesaikan peminjaman tersebut sebelum meminjam buku lain.');
        }

        // Check book stock
        $bookStock = Book::where('slug', $request->input('book_slug'))->value('stok');
        if ($bookStock <= 0) {
            return ResponseFormatter::error(400, null, 'Stok buku tidak mencukupi untuk peminjaman saat ini.');
        }

        // Validate the request
        $validated = $request->validate([
            'book_slug' => 'required|string|exists:books,slug',
            'borrow_date' => 'required|date',
        ]);

        $book = Book::where('slug', $validated['book_slug'])->first();

        $borrowing = Borrowing::create([
            'user_id' => $request->user()->id,
            'book_id' => $book->id,
            'borrow_date' => $validated['borrow_date'],
            'due_date' => date('Y-m-d', strtotime($validated['borrow_date'] . ' + 7 days')),
            'status' => 'Pending',
        ]);

        Notification::create([
            'user_id' => $request->user()->id,
            'tipe' => 'info',
            'judul' => 'Peminjaman Buku Diajukan',
            'pesan' => 'Anda telah mengajukan peminjaman buku "' . $book->judul . '". Silahkan tunggu konfirmasi dari admin.',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Berhasil meminjam buku');
    }

    public function getUserBorrowings(Request $request)
    {
        $borrowings = Borrowing::where('user_id', $request->user()->id)->with('book')->get();

        $borrowings = $borrowings->map(function ($borrowing) {
            return $borrowing->api_response;
        });

        return ResponseFormatter::success($borrowings);
    }

    public function adminDashboardBorrowings()
    {
        $borrowings = Borrowing::with('book', 'user')->get();
        $books = Book::all();

        $borrowings = $borrowings->map(function ($borrowing) {
            return $borrowing->admin_dashboard_response;
        });

        // Get monthly borrowing statistics for the last 6 months
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->translatedFormat('F'); // Full month name in Indonesian
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $count = Borrowing::whereBetween('borrow_date', [$startOfMonth, $endOfMonth])
                ->whereIn('status', ['Dipinjam', 'Dikembalikan', 'Terlambat'])
                ->count();

            $monthlyStats[] = [
                'month' => $monthName,
                'count' => $count,
            ];
        }

        // Get top 5 most borrowed books this month
        $startOfMonth = now()->startOfMonth();
        $endOfMonth = now()->endOfMonth();

        $topBooks = Borrowing::select('book_id')
            ->selectRaw('COUNT(*) as borrow_count')
            ->whereBetween('borrow_date', [$startOfMonth, $endOfMonth])
            ->groupBy('book_id')
            ->orderByDesc('borrow_count')
            ->limit(5)
            ->with('book')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->book_id,
                    'title' => $item->book->judul,
                    'author' => $item->book->pengarang,
                    'count' => $item->borrow_count,
                ];
            });

        $data = [
            'total_books' => $books->count(),
            'total_borrowings' => $borrowings->count(),
            'total_pending' => $borrowings->where('status', 'Pending')->count(),
            'total_active' => $borrowings->where('status', 'Dipinjam')->count(),
            'total_overdue' => $borrowings->where('status', 'Terlambat')->count(),
            'total_returned' => $borrowings->where('status', 'Dikembalikan')->count(),
            'books_added_this_month' => $books->where('created_at', '>=', now()->startOfWeek()->format('Y-m-d'))->count(),
            'books_borrowed_this_month' => $borrowings->where('borrow_date', '>=', now()->startOfWeek()->format('Y-m-d'))->whereIn('status', ['Dipinjam', 'Dikembalikan'])->count(),
            'books_overdue_this_month' => $borrowings->where('status', 'Terlambat')->where('due_date', '>=', now()->startOfWeek()->format('Y-m-d'))->count(),
            'pending_borrowings' => $borrowings->where('status', 'Pending')->values()->take(3),
            'late_borrowings' => $borrowings->where('status', 'Terlambat')->values()->take(3),
            'monthly_stats' => $monthlyStats,
            'top_books' => $topBooks,
        ];

        return ResponseFormatter::success($data);
    }
}
