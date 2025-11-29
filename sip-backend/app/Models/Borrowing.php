<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Borrowing extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'book_id',
        'borrow_date',
        'due_date',
        'return_date',
        'status',
        'denda',
        'notes',
    ];

    protected static function boot(){
        parent::boot();

        static::creating(function ($borrowing) {
            if (!$borrowing->id) {
                $borrowing->id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function getApiResponseAttribute()
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'borrow_date' => $this->borrow_date,
            'due_date' => $this->due_date,
            'status' => $this->status,
        ];
    }
}
