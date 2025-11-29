<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Notification::create([
            'user_id' => 3,
            'tipe' => 'important',
            'pesan' => "Buku 'Jokowi si Tukang Ngutang' sudah mencapai tenggat pengembalian hari ini.", 
        ]);
    }
}
