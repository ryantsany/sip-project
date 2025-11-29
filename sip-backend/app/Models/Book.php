<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'judul',
        'cover_url',
        'pengarang',
        'penerbit',
        'tahun',
        'isbn',
        'deskripsi',
        'kategori',
        'tag',
        'jumlah',
        'stok',
        'status'
    ];

    
}
