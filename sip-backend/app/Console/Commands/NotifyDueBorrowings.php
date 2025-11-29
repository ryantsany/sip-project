<?php

namespace App\Console\Commands;

use App\Models\Borrowing;
use App\Models\Notification;
use Illuminate\Console\Command;

class NotifyDueBorrowings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notify:due-borrowings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to users with borrowings due soon';

    /**
     * Execute the console command.
     */
    public function handle(){
        $today = now()->toDateString();

        $borrowings = Borrowing::where('due_date', $today)
                ->where('status', 'Dipinjam')
                ->get();

        foreach ($borrowings as $borrowing) {
            $borrowing->status = 'Tenggat';
            $borrowing->save();
            
            Notification::create([
                'user_id' => $borrowing->user_id,
                'tipe' => 'important',
                'pesan' => "Buku '{$borrowing->book->judul}' sudah mencapai tenggat pengembalian hari ini.",
            ]);
        }

        $this->info("Notifikasi tenggat berhasil dikirim.");
    }
}
