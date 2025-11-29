<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'tipe',
        'pesan',
        'is_read',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getApiResponseAttribute()
    {
        return [
            'id' => $this->id,
            'tipe' => $this->tipe,
            'pesan' => $this->pesan,
            'is_read' => $this->is_read,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
