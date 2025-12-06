<?php

namespace App\Console\Commands;

use App\Models\Borrowing;
use App\Models\Notification;
use Carbon\Carbon;
use Illuminate\Console\Command;

class NotifyLateBorrowings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:late-borrowings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users with late borrowings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::now();

        $borrowings = Borrowing::where('status', 'Tenggat')->get();

        foreach ($borrowings as $borrowing) {
            $dueDate = Carbon::parse($borrowing->due_date);

            if($today->isAfter($dueDate->copy()->addDays(7))){
                if($borrowing->denda == 0){
                    $borrowing->status = 'Terlambat';
                    $borrowing->denda = 15000;
                    $borrowing->due_date = date('Y-m-d', strtotime($today. ' + 7 days'));
                    $borrowing->save();

                    Notification::create([
                        'user_id' => $borrowing->user_id,
                        'judul' => "Pemberitahuan Denda Terlambat Pengembalian Buku",
                        'tipe' => 'important',
                        'pesan' => "Denda sebesar Rp 15.000 telah dikenakan untuk buku '{$borrowing->book->judul}' karena terlambat mengembalikan. Harap segera mengembalikan buku tersebut untuk menghindari denda tambahan.",
                    ]);
                } else if($borrowing->denda > 0) {
                    $borrowing->denda += 2000;
                    $borrowing->due_date = date('Y-m-d', strtotime($today. ' + 7 days'));
                    $borrowing->save();

                    Notification::create([
                        'user_id' => $borrowing->user_id,
                        'judul' => "Pemberitahuan Denda Terlambat Pengembalian Buku",
                        'tipe' => 'important',
                        'pesan' => "Denda tambahan sebesar Rp 2.000 telah dikenakan untuk buku '{$borrowing->book->judul}' karena masih belum mengembalikan. Harap segera mengembalikan buku tersebut untuk menghindari denda tambahan.",
                    ]);
                }
            }
        }

        $this->info("Notifikasi terlambat berhasil dikirim.");
    }
}
