<?php

namespace Database\Seeders;

use App\Models\Borrowing;
use App\Models\User;
use App\Models\Book;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BorrowingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get users (exclude admin)
        $users = User::where('role', 'siswa')->get();
        $books = Book::all();

        if ($users->isEmpty() || $books->isEmpty()) {
            $this->command->warn('No users or books found. Please run UserSeeder and BookSeeder first.');
            return;
        }

        $borrowingsData = [
            // Active borrowings (currently borrowed)
            [
                'user_index' => 0,
                'book_index' => 0,
                'borrow_date' => Carbon::now()->subDays(5),
                'due_date' => Carbon::now()->addDays(9),
                'return_date' => null,
                'status' => 'Dipinjam',
                'denda' => 0,
                'notes' => null,
            ],
            [
                'user_index' => 1,
                'book_index' => 1,
                'borrow_date' => Carbon::now()->subDays(3),
                'due_date' => Carbon::now()->addDays(11),
                'return_date' => null,
                'status' => 'Dipinjam',
                'denda' => 0,
                'notes' => null,
            ],
            [
                'user_index' => 2,
                'book_index' => 2,
                'borrow_date' => Carbon::now()->subDays(10),
                'due_date' => Carbon::now()->addDays(4),
                'return_date' => null,
                'status' => 'Dipinjam',
                'denda' => 0,
                'notes' => null,
            ],
            // Overdue borrowing
            [
                'user_index' => 3,
                'book_index' => 3,
                'borrow_date' => Carbon::now()->subDays(20),
                'due_date' => Carbon::now()->subDays(6),
                'return_date' => null,
                'status' => 'Terlambat',
                'denda' => 15000,
                'notes' => 'Terlambat 6 hari',
            ],
            // Returned borrowings
            [
                'user_index' => 0,
                'book_index' => 4,
                'borrow_date' => Carbon::now()->subDays(30),
                'due_date' => Carbon::now()->subDays(16),
                'return_date' => Carbon::now()->subDays(18),
                'status' => 'Dikembalikan',
                'denda' => 0,
                'notes' => 'Dikembalikan tepat waktu',
            ],
            [
                'user_index' => 1,
                'book_index' => 5,
                'borrow_date' => Carbon::now()->subDays(25),
                'due_date' => Carbon::now()->subDays(11),
                'return_date' => Carbon::now()->subDays(8),
                'status' => 'Dikembalikan',
                'denda' => 15000,
                'notes' => 'Terlambat 3 hari, denda sudah dibayar',
            ],
            [
                'user_index' => 4,
                'book_index' => 0,
                'borrow_date' => Carbon::now()->subDays(40),
                'due_date' => Carbon::now()->subDays(26),
                'return_date' => Carbon::now()->subDays(26),
                'status' => 'Dikembalikan',
                'denda' => 0,
                'notes' => null,
            ],
            // Pending borrowing request
            [
                'user_index' => 5,
                'book_index' => 6,
                'borrow_date' => Carbon::now(),
                'due_date' => Carbon::now()->addDays(14),
                'return_date' => null,
                'status' => 'Pending',
                'denda' => 0,
                'notes' => 'Menunggu persetujuan admin',
            ],
        ];

        foreach ($borrowingsData as $data) {
            $userIndex = $data['user_index'] % $users->count();
            $bookIndex = $data['book_index'] % $books->count();

            Borrowing::create([
                'user_id' => $users[$userIndex]->id,
                'book_id' => $books[$bookIndex]->id,
                'borrow_date' => $data['borrow_date']->format('Y-m-d'),
                'due_date' => $data['due_date']->format('Y-m-d'),
                'return_date' => $data['return_date']?->format('Y-m-d'),
                'status' => $data['status'],
                'denda' => $data['denda'],
                'notes' => $data['notes'],
            ]);
        }

        $this->command->info('Borrowings seeded successfully: ' . count($borrowingsData) . ' records created.');
    }
}
