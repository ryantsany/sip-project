<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Notification extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'tipe',
        'judul',
        'pesan',
        'is_read',
    ];

    protected static function boot(){
        parent::boot();

        static::creating(function ($notification) {
            if (!$notification->id) {
                $notification->id = (string) Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getApiResponseAttribute()
    {
        return [
            'id' => $this->id,
            'tipe' => $this->tipe,
            'judul' => $this->judul,
            'pesan' => $this->pesan,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
