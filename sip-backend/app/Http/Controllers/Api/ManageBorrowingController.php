<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Borrowing;
use App\Models\Notification;
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

        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'success',
            'judul' => 'Perpanjangan Peminjaman Berhasil',
            'pesan' => 'Peminjaman buku "' . optional($borrowing->book)->judul . '" telah diperpanjang 1 minggu. Harap kembalikan tepat waktu.',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Tenggat diperpanjang 1 minggu.');
    }

    public function reportLost(Request $request, Borrowing $borrowing)
    {
        $borrowing->loadMissing('book', 'user');

        if ($borrowing->user_id !== $request->user()->id) {
            return ResponseFormatter::error(403, null, 'Tidak diizinkan melaporkan peminjaman pengguna lain.');
        }

        if (!in_array($borrowing->status, ['Dipinjam', 'Terlambat', 'Tenggat'], true)) {
            return ResponseFormatter::error(400, null, 'Hanya peminjaman aktif yang dapat dilaporkan hilang.');
        }

        $borrowing->status = 'Hilang';
        $borrowing->notes = 'Laporan kehilangan diterima pada ' . now()->format('Y-m-d H:i:s') . '. ' . ($borrowing->notes ?? '');
        $borrowing->denda = $borrowing->denda + 100000;
        $borrowing->book()->decrement('jumlah');
        $borrowing->save();

        // Notify user
        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'important',
            'judul' => 'Laporan Kehilangan',
            'pesan' => 'Laporan kehilangan untuk buku "' . optional($borrowing->book)->judul . '" telah diterima. Denda sebesar Rp' . number_format($borrowing->denda, 0, ',', '.') . ' telah dikenakan pada akun Anda.',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Laporan kehilangan berhasil dikirim.');
    }

    public function acceptLostFine(Borrowing $borrowing)
    {
        $borrowing->loadMissing('book', 'user');

        if ($borrowing->status !== 'Hilang') {
            return ResponseFormatter::error(400, null, 'Hanya peminjaman berstatus hilang yang dapat diproses denda.');
        }

        if ($borrowing->notes === 'Lunas') {
            return ResponseFormatter::error(400, null, 'Denda kehilangan sudah diproses lunas.');
        }

        $borrowing->notes = 'Lunas';
        $borrowing->return_date = now()->format('Y-m-d');
        $borrowing->save();

        // Notify user
        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'success',
            'judul' => 'Denda Kehilangan Lunas',
            'pesan' => 'Denda kehilangan untuk buku "' . optional($borrowing->book)->judul . '" telah dibayarkan.',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Denda kehilangan telah dibayarkan.');
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
        $borrowing->book()->decrement('stok');
        $borrowing->save();

        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'success',
            'judul' => 'Peminjaman Disetujui',
            'pesan' => 'Peminjaman buku "' . optional($borrowing->book)->judul . '" telah disetujui oleh admin. Silahkan ambil bukunya di perpustakaan.',
            'is_read' => false,
        ]);

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

        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'success',
            'judul' => 'Buku Dikembalikan',
            'pesan' => 'Anda telah mengembalikan buku "' . optional($borrowing->book)->judul . '". Terima kasih!',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Buku telah dikembalikan.');
    }

    public function rejectBorrowing($id)
    {
        $borrowing = Borrowing::findOrFail($id);
        $borrowing->loadMissing('book');

        if ($borrowing->status !== 'Pending') {
            return ResponseFormatter::error(400, null, 'Hanya pengajuan berstatus pending yang dapat ditolak.');
        }

        $borrowing->status = 'Ditolak';
        $borrowing->save();

        Notification::create([
            'user_id' => $borrowing->user_id,
            'tipe' => 'info',
            'judul' => 'Peminjaman Buku Ditolak',
            'pesan' => 'Peminjaman buku "' . optional($borrowing->book)->judul . '" telah ditolak oleh admin. Silahkan datang ke perpustakaan untuk informasi lebih lanjut.',
            'is_read' => false,
        ]);

        return ResponseFormatter::success($borrowing->api_response, 'Peminjaman telah ditolak.');
    }
}
