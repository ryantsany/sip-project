<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Notification::create([
            'id' => (string) Str::uuid(),
            'user_id' => 3,
            'judul' => "Pemberitahuan Tenggat Pengembalian Buku",
            'tipe' => 'important',
            'pesan' => "Buku 'Jokowi si Tukang Ngutang' sudah mencapai tenggat pengembalian hari ini. sudah mencapai tenggat pengembalian hari ini. Harap segera mengembalikan buku tersebut untuk menghindari denda.", 
        ]);

        Notification::create([
            'id' => (string) Str::uuid(),
            'user_id' => 13,
            'judul' => "Pemberitahuan Tenggat Pengembalian Buku",
            'tipe' => 'important',
            'pesan' => "Buku 'Dasar-Dasar Pemrograman Web' sudah mencapai tenggat pengembalian hari ini. sudah mencapai tenggat pengembalian hari ini. Harap segera mengembalikan buku tersebut untuk menghindari denda.", 
        ]);
        Notification::create([
            'id' => (string) Str::uuid(),
            'user_id' => 13,
            'judul' => "Pemberitahuan Denda Terlambat Pengembalian Buku",
            'tipe' => 'important',
            'pesan' => "Denda sebesar Rp 15.000 telah dikenakan untuk buku 'Dasar-Dasar Pemrograman Web' karena terlambat mengembalikan.Harap segera mengembalikan buku tersebut untuk menghindari denda tambahan.", 
        ]);
    }
}
