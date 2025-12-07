<?php

namespace Database\Seeders;

use App\Models\Book;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $booksData = [
            [
                'judul' => 'Filosofi Teras: Cara Hidup Bahagia Masa Kini',
                'cover_url' => '/storage/covers/filosofi-teras-cara-hidup-bahagia-masa-kini.jpg',
                'pengarang' => 'Henry Manampiring',
                'penerbit' => 'Kompas',
                'tahun' => 2018,
                'isbn' => '978-602-412-518-9',
                'deskripsi' => 'Panduan praktis untuk menghadapi emosi negatif dengan prinsip-prinsip Stoisisme.',
                'kategori' => 'Pengembangan Diri',
                'jumlah' => 12,
                'stok' => 8,
                'status' => 'available',
            ],
            [
                'judul' => 'Bumi Manusia',
                'cover_url' => '/storage/covers/bumi-manusia.jpg',
                'pengarang' => 'Pramoedya Ananta Toer',
                'penerbit' => 'Hasta Mitra',
                'tahun' => 1980,
                'isbn' => '978-979-99408-0-9',
                'deskripsi' => 'Novel pertama dari Tetralogi Buru yang mengisahkan perjuangan Minke di era kolonial.',
                'kategori' => 'Fiksi Sejarah',
                'jumlah' => 8,
                'stok' => 0,
                'status' => 'unavailable',
            ],
            [
                'judul' => 'Atomic Habits: Perubahan Kecil, Hasil Luar Biasa',
                'cover_url' => '/storage/covers/atomic-habits-perubahan-kecil-hasil-luar-biasa.jpg',
                'pengarang' => 'James Clear',
                'penerbit' => 'Gramedia Pustaka Utama',
                'tahun' => 2019,
                'isbn' => '978-602-06331-5-6',
                'deskripsi' => 'Metode yang terbukti mudah untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk.',
                'kategori' => 'Pengembangan Diri',
                'jumlah' => 25,
                'stok' => 20,
                'status' => 'available',
            ],
            [
                'judul' => 'Kisah Tanah Jawa: Jogja dan Permasalahannya',
                'cover_url' => '/storage/covers/kisah-tanah-jawa-jogja-dan-permasalahannya.jpg',
                'pengarang' => 'Tim Kisah Tanah Jawa',
                'penerbit' => 'GagasMedia',
                'tahun' => 2020,
                'isbn' => '978-979-780-975-7',
                'deskripsi' => 'Kumpulan cerita horor dan misteri berdasarkan riset dan pengalaman di Pulau Jawa.',
                'kategori' => 'Misteri',
                'jumlah' => 15,
                'stok' => 15,
                'status' => 'available',
            ],
            [
                'judul' => 'Dasar-Dasar Pemrograman Web dengan PHP dan MySQL',
                'cover_url' => '/storage/covers/dasar-dasar-pemrograman-web-dengan-php-dan-MySQL.jpg',
                'pengarang' => 'Abdul Kadir',
                'penerbit' => 'Andi Offset',
                'tahun' => 2022,
                'isbn' => '978-623-01-2917-0',
                'deskripsi' => 'Buku panduan komprehensif untuk memulai pemrograman web menggunakan PHP dan database MySQL.',
                'kategori' => 'Teknologi',
                'jumlah' => 10,
                'stok' => 5,
                'status' => 'available',
            ],
            [
                'judul' => 'Cantik Itu Luka',
                'cover_url' => '/storage/covers/cantik-itu-luka.jpg',
                'pengarang' => 'Eka Kurniawan',
                'penerbit' => 'Gramedia Pustaka Utama',
                'tahun' => 2002,
                'isbn' => '978-979-22-6720-7',
                'deskripsi' => 'Kisah epik yang memadukan sejarah, mitos, dan kritik sosial dengan gaya realisme magis.',
                'kategori' => 'Fiksi',
                'jumlah' => 7,
                'stok' => 2,
                'status' => 'available',
            ],
            [
                'judul' => 'The Lean Startup: How Today\'s Entrepreneurs Use Continuous Innovation',
                'cover_url' => '/storage/covers/the-lean-startup-how-todays-entrepreneurs-use-continuous-innovation.jpg',
                'pengarang' => 'Eric Ries',
                'penerbit' => 'Crown Business',
                'tahun' => 2011,
                'isbn' => '978-030-788-789-4',
                'deskripsi' => 'Metodologi untuk membangun bisnis yang sukses dengan validasi ide cepat dan umpan balik pelanggan.',
                'kategori' => 'Bisnis',
                'jumlah' => 9,
                'stok' => 9,
                'status' => 'available',
            ],
            [
                'judul' => 'Laskar Pelangi',
                'cover_url' => '/storage/covers/laskar-pelangi.jpg',
                'pengarang' => 'Andrea Hirata',
                'penerbit' => 'Bentang Pustaka',
                'tahun' => 2005,
                'isbn' => '978-979-3062-79-1',
                'deskripsi' => 'Kisah inspiratif tentang semangat belajar anak-anak di Belitung yang serba kekurangan.',
                'kategori' => 'Fiksi',
                'jumlah' => 18,
                'stok' => 10,
                'status' => 'available',
            ],
            [
                'judul' => 'Sapiens: Riwayat Singkat Umat Manusia',
                'cover_url' => '/storage/covers/sapiens-riwayat-singkat-umat-manusia.jpg',
                'pengarang' => 'Yuval Noah Harari',
                'penerbit' => 'KPG',
                'tahun' => 2017,
                'isbn' => '978-602-424-401-9',
                'deskripsi' => 'Penjelajahan evolusi manusia, dari pemburu-pengumpul hingga peradaban masa kini.',
                'kategori' => 'Non-Fiksi',
                'jumlah' => 11,
                'stok' => 0,
                'status' => 'unavailable',
            ],
            [
                'judul' => 'Teka-Teki Silang Komputer dan Jaringan Dasar',
                'cover_url' => '/storage/covers/teka-teki-silang-komputer-dan-jaringan-dasar.jpg',
                'pengarang' => 'Jubilee Enterprise',
                'penerbit' => 'Elex Media Komputindo',
                'tahun' => 2023,
                'isbn' => '978-623-00-5111-6',
                'deskripsi' => 'Buku latihan soal berbentuk teka-teki silang untuk memahami konsep dasar jaringan komputer.',
                'kategori' => 'Pendidikan',
                'jumlah' => 5,
                'stok' => 5,
                'status' => 'available',
            ],
            [
                'judul' => 'Laut Bercerita',
                'cover_url' => '/storage/covers/laut-bercerita.jpg',
                'pengarang' => 'Leila S. Chudori',
                'penerbit' => 'Kepustakaan Populer Gramedia',
                'tahun' => 2017,
                'isbn' => '978-602-424-694-5',
                'deskripsi' => 'Novel tentang kisah persahabatan, cinta, dan perjuangan aktivis di masa Orde Baru.',
                'kategori' => 'Fiksi Sejarah',
                'jumlah' => 14,
                'stok' => 11,
                'status' => 'available',
            ],
            [
                'judul' => 'Rich Dad Poor Dad: What the Rich Teach Their Kids About Money',
                'cover_url' => '/storage/covers/rich-dad-poor-dad-what-the-rich-teach-their-kids-about-money.jpg',
                'pengarang' => 'Robert T. Kiyosaki',
                'penerbit' => 'PT Gramedia Pustaka Utama',
                'tahun' => 2002,
                'isbn' => '979-686-501-5',
                'deskripsi' => 'Prinsip-prinsip dasar literasi keuangan dan cara pandang orang kaya terhadap uang.',
                'kategori' => 'Bisnis',
                'jumlah' => 16,
                'stok' => 1,
                'status' => 'available',
            ],
            [
                'judul' => 'A Brief History of Time',
                'cover_url' => '/storage/covers/a-brief-history-of-time.jpg',
                'pengarang' => 'Stephen Hawking',
                'penerbit' => 'Bantam Books',
                'tahun' => 1988,
                'isbn' => '978-055-338-016-3',
                'deskripsi' => 'Penjelasan ilmiah yang populer tentang alam semesta, lubang hitam, dan teori relativitas.',
                'kategori' => 'Sains',
                'jumlah' => 6,
                'stok' => 0,
                'status' => 'unavailable',
            ],
            [
                'judul' => 'Dilan 1990',
                'cover_url' => '/storage/covers/dilan-1990.jpg',
                'pengarang' => 'Pidi Baiq',
                'penerbit' => 'Pastel Books',
                'tahun' => 2014,
                'isbn' => '978-602-7870-41-3',
                'deskripsi' => 'Kisah romantis remaja SMA di Bandung pada tahun 1990.',
                'kategori' => 'Fiksi Remaja',
                'jumlah' => 20,
                'stok' => 18,
                'status' => 'available',
            ],
            [
                'judul' => 'Ekonomi Pembangunan: Teori dan Kebijakan',
                'cover_url' => '/storage/covers/ekonomi-pembangunan-teori-dan-kebijakan.jpg',
                'pengarang' => 'Lincolin Arsyad',
                'penerbit' => 'BPFE Yogyakarta',
                'tahun' => 2019,
                'isbn' => '978-602-453-125-9',
                'deskripsi' => 'Buku ajar yang membahas konsep dan aplikasi ekonomi pembangunan di negara berkembang.',
                'kategori' => 'Pendidikan',
                'jumlah' => 8,
                'stok' => 4,
                'status' => 'available',
            ],
            [
                'judul' => 'Chicken Soup for the Soul: Edisi Indonesia',
                'cover_url' => '/storage/covers/chicken-soup-for-the-soul-edisi-Indonesia.jpg',
                'pengarang' => 'Jack Canfield & Mark Victor Hansen',
                'penerbit' => 'Elex Media Komputindo',
                'tahun' => 2000,
                'isbn' => '978-979-20-1925-5',
                'deskripsi' => 'Kumpulan kisah inspiratif tentang kehidupan, cinta, dan kebijaksanaan.',
                'kategori' => 'Inspirasi',
                'jumlah' => 10,
                'stok' => 7,
                'status' => 'available',
            ],
            [
                'judul' => 'The Lord of the Rings: The Fellowship of the Ring',
                'cover_url' => '/storage/covers/the-lord-of-the-rings-the-fellowship-of-the-ring.jpg',
                'pengarang' => 'J.R.R. Tolkien',
                'penerbit' => 'Allen & Unwin',
                'tahun' => 1954,
                'isbn' => '978-061-826-029-2',
                'deskripsi' => 'Bagian pertama dari trilogi fantasi epik tentang perjalanan Frodo Baggins.',
                'kategori' => 'Fantasi',
                'jumlah' => 5,
                'stok' => 0,
                'status' => 'unavailable',
            ],
            [
                'judul' => 'Seri Komik Sains: Mengenal Antariksa',
                'cover_url' => '/storage/covers/seri-komik-sains-mengenal-antariksa.jpg',
                'pengarang' => 'Lee Yong Hwan',
                'penerbit' => 'Bhuana Ilmu Populer',
                'tahun' => 2021,
                'isbn' => '978-623-04-0309-8',
                'deskripsi' => 'Komik edukasi untuk anak-anak yang menjelaskan tata surya, bintang, dan galaksi.',
                'kategori' => 'Komik Edukasi',
                'jumlah' => 22,
                'stok' => 20,
                'status' => 'available',
            ],
            [
                'judul' => 'Negeri 5 Menara',
                'cover_url' => '/storage/covers/negeri-5-menara.jpg',
                'pengarang' => 'Ahmad Fuadi',
                'penerbit' => 'Gramedia Pustaka Utama',
                'tahun' => 2009,
                'isbn' => '978-979-22-4780-3',
                'deskripsi' => 'Kisah inspiratif tentang enam sahabat yang menuntut ilmu di pondok pesantren.',
                'kategori' => 'Inspirasi',
                'jumlah' => 13,
                'stok' => 9,
                'status' => 'available',
            ],
        ];

        // Kosongkan array untuk menampung data yang sudah dihitung slug-nya
        $finalBooks = [];

        foreach ($booksData as $bookData) {
            $judul = $bookData['judul'];
            $baseSlug = Str::slug($judul);
            $slug = $baseSlug;
            $count = 0;

            // Logika untuk menangani duplikasi judul
            // Loop melalui data yang sudah diproses (finalBooks) untuk mencari duplikasi
            foreach ($finalBooks as $finalBook) {
                if ($finalBook['judul'] === $judul) {
                    $count++;
                }
            }

            // Jika ada duplikasi di data *seeder* ini, tambahkan penomoran
            if ($count > 0) {
                $slug = $baseSlug . '-' . ($count + 1);
            }

            $bookData['slug'] = $slug;
            $finalBooks[] = $bookData;
            Book::create($bookData);
        }
    }
}
