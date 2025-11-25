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
            'nomor_induk' => '1313600001',
            'nama' => 'Admin',
            'role' => 'admin',
            'password' => Hash::make('password123'),
            'first_login' => false,
        ]);
    }
}
