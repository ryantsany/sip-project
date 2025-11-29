<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'nomor_induk' => '1814320001',
            'nama' => 'Admin',
            'role' => 'admin',
            'password' => Hash::make('password123'),
            'first_login' => false,
        ]);

        User::create([
            'nomor_induk' => '1313600001',
            'nama' => 'User 1',
            'role' => 'siswa',
            'first_login' => true,
        ]);

        for ($it = 1; $it <= 10; $it++) {
            User::create([
                'nomor_induk' => '131360000' . ($it + 1),
                'nama' => 'User' . $it,
                'role' => 'siswa',
                'password' => Hash::make('password123'),
                'first_login' => false,
            ]);
        }
    }
}
