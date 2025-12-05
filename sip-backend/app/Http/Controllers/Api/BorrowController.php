<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\ResponseFormatter;
use Illuminate\Http\Request;

class BorrowController extends Controller
{
    public function borrowBook(Request $request){
        $validated = $request->validate([
            'book_slug' => 'required|string|exists:books,slug',
            'borrow_date' => 'required|date',
        ]);

        $book = Book::where('slug', $validated['book_slug'])->first();

        $borrowing = Borrowing::create([
            'user_id' => $request->user()->id,
            'book_id' => $book->id,
            'borrow_date' => $validated['borrow_date'],
            'due_date' => date('Y-m-d', strtotime($validated['borrow_date']. ' + 7 days')),
            'status' => 'Pending',
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Berhasil meminjam buku');
    }

    public function getUserBorrowings(Request $request){
        $borrowings = Borrowing::where('user_id', $request->user()->id)->with('book')->get();

        $borrowings = $borrowings->map(function($borrowing){
            return $borrowing->api_response;
        });

        return ResponseFormatter::success($borrowings);
    }

    public function adminDashboardBorrowings(){
        $borrowings = Borrowing::with('book', 'user')->get();
        $books = Book::all();

        $borrowings = $borrowings->map(function($borrowing){
            return $borrowing->admin_dashboard_response;
        });

        $data = [
            'total_books' => $books->count(),
            'total_borrowings' => $borrowings->count(),
            'total_pending' => $borrowings->where('status', 'Pending')->count(),
            'total_active' => $borrowings->where('status', 'Dipinjam')->count(),
            'total_overdue' => $borrowings->where('status', 'Terlambat')->count(),
            'total_returned' => $borrowings->where('status', 'Dikembalikan')->count(),
            'books_added_this_month' => $books->where('created_at', '>=', now()->startOfMonth()->format('Y-m-d'))->count(),
            'books_borrowed_this_month' => $borrowings->where('borrow_date', '>=', now()->startOfMonth()->format('Y-m-d'))->whereIn('status', ['Dipinjam', 'Dikembalikan'])->count(),
            'books_overdue_this_month' => $borrowings->where('status', 'Terlambat')->where('borrow_date', '>=', now()->startOfMonth()->format('Y-m-d'))->count(),
            'pending_borrowings' => $borrowings->where('status', 'Pending')->values()->take(3),
            'late_borrowings' => $borrowings->where('status', 'Terlambat')->values()->take(3),
        ];

        return ResponseFormatter::success($data);
    }
}
