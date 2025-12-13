<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    public function test_add_new_book()
    {
        $user = User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'admin',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        Category::create([
            'name' => 'Teknologi',
            'slug' => 'teknologi',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tambah-buku', [
            'judul' => 'New Book',
            'cover_url' => 'http://example.com/cover.jpg',
            'penulis' => 'John Doe',
            'penerbit' => 'Tech Press',
            'tahun' => 2023,
            'isbn' => '978-061-826-029-2',
            'kategori_id' => 1,
            'deskripsi' => 'A book about technology.',
            'stok' => 10,
            'jumlah' => 10,
            'status' => 'available'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'meta' => [
                         'code',
                         'messages' => [],
                         'validations',
                         'response_date'
                     ],
                     'data' => [
                         'book' => [
                             'id',
                             'judul',
                             'cover_url',
                             'pengarang',
                             'penerbit',
                             'tahun',
                             'isbn',
                             'deskripsi',
                             'category_id',
                             'jumlah',
                             'stok',
                             'status',
                             'created_at',
                             'updated_at'
                         ]
                     ],
                 ]);
    }

    public function test_regular_user_cannot_add_book()
    {
        $user = User::create([
            'nomor_induk' => '1313600015',
            'nama' => 'Wowo',
            'role' => 'siswa',
            'password' => bcrypt('password123'),
            'first_login' => false,
        ]);

        Category::create([
            'name' => 'Teknologi',
            'slug' => 'teknologi',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tambah-buku', [
            'judul' => 'New Book',
            'cover_url' => 'http://example.com/cover.jpg',
            'penulis' => 'John Doe',
            'penerbit' => 'Tech Press',
            'tahun' => 2023,
            'isbn' => '978-061-826-029-2',
            'kategori_id' => 1,
            'deskripsi' => 'A book about technology.',
            'stok' => 10,
            'jumlah' => 10,
            'status' => 'available'
        ]);

        $response->assertStatus(403);
    }
}
