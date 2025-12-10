<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\ResponseFormatter;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ManageBorrowingController extends Controller
{
    public function getAllBorrowings()
    {
        $borrowings = Borrowing::with(['user', 'book'])
            ->latest('created_at')
            ->get()
            ->map(function ($borrowing) {
                return [
                    'id' => $borrowing->id,
                    'borrower' => optional($borrowing->user)->nama,
                    'nomor_induk' => optional($borrowing->user)->nomor_induk,
                    'kelas' => optional($borrowing->user)->kelas,
                    'book_title' => optional($borrowing->book)->judul,
                    'book_slug' => optional($borrowing->book)->slug,
                    'borrow_date' => $borrowing->borrow_date,
                    'due_date' => $borrowing->due_date,
                    'return_date' => $borrowing->return_date,
                    'status' => $borrowing->status,
                    'denda' => $borrowing->denda,
                    'notes' => $borrowing->notes,
                ];
            })
            ->values();

        return ResponseFormatter::success([
            'borrowings' => $borrowings,
        ]);
    }

    public function extendBorrow(Borrowing $borrowing)
    {
        $borrowing->loadMissing('book');

        if ($borrowing->status !== 'Dipinjam') {
            return ResponseFormatter::error(400, null, 'Hanya peminjaman aktif yang dapat diperpanjang.');
        }

        $borrowStart = $borrowing->borrow_date
            ? Carbon::parse($borrowing->borrow_date)
            : Carbon::parse($borrowing->due_date)->subDays(7);

        $originalDueDate = $borrowStart->copy()->addDays(7);
        $currentDueDate = Carbon::parse($borrowing->due_date);

        if ($currentDueDate->greaterThan($originalDueDate)) {
            return ResponseFormatter::error(400, null, 'Peminjaman sudah diperpanjang satu kali.');
        }

        $borrowing->due_date = $currentDueDate->addDays(7)->format('Y-m-d');
        $borrowing->save();

        return ResponseFormatter::success($borrowing->api_response, 'Tenggat diperpanjang 1 minggu.');
    }

    public function adminAcceptBorrow(Borrowing $borrowing)
    {
        $borrowing->loadMissing('book');

        if ($borrowing->status !== 'Pending') {
            return ResponseFormatter::error(400, null, 'Hanya pengajuan berstatus pending yang dapat disetujui.');
        }

        if (!$borrowing->borrow_date) {
            $borrowing->borrow_date = now()->format('Y-m-d');
        }

        $borrowing->status = 'Dipinjam';
        $borrowing->due_date = Carbon::parse($borrowing->borrow_date)->addDays(7)->format('Y-m-d');
        $borrowing->save();

        return ResponseFormatter::success($borrowing->api_response, 'Peminjaman berhasil disetujui.');
    }

    public function returnBook($id)
    {
        $borrowing = Borrowing::findOrFail($id);
        $borrowing->loadMissing('book');

        if ($borrowing->status === 'Dikembalikan') {
            return ResponseFormatter::error(400, null, 'Peminjaman sudah ditandai dikembalikan.');
        }

        $borrowing->status = 'Dikembalikan';
        $borrowing->return_date = now()->format('Y-m-d');
        $borrowing->book()->increment('stok');
        $borrowing->save();

        return ResponseFormatter::success($borrowing->api_response, 'Buku telah dikembalikan.');
    }
}
