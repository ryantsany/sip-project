<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

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
        'category_id',
        'jumlah',
        'stok',
        'status',
        'slug'
    ];

    protected static function boot(){
        parent::boot();

        static::creating(function ($buku) {
            $count = Book::where('slug', 'LIKE', Str::slug($buku->judul) . '%')->count();
            if ($count > 0) {
                $buku->slug = Str::slug($buku->judul) . '-' . ($count + 1);
            } else {
                $buku->slug = Str::slug( $buku->judul);
            }
        });
    }

    /**
     * Get the category this book belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function getApiResponseAttribute(){
        return [
            'judul' => $this->judul,
            'cover_url' => $this->cover_url,
            'penulis' => $this->pengarang,
            'penerbit' => $this->penerbit,
            'tahun' => $this->tahun,
            'isbn' => $this->isbn,
            'deskripsi' => $this->deskripsi,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ] : null,
            'jumlah' => $this->jumlah,
            'stok' => $this->stok,
            'status' => $this->status,
            'slug' => $this->slug,
        ];
    }
    
}