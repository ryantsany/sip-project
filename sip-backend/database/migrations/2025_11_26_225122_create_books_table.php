<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('cover_url')->nullable();
            $table->string('penulis');
            $table->string('penerbit');
            $table->year('tahun');
            $table->string('isbn')->unique();
            $table->text('deskripsi')->nullable();
            $table->string('kategori')->nullable();
            $table->integer('jumlah')->default(1);
            $table->integer('stok')->default(1);
            $table->string('status');
            $table->string('slug');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
