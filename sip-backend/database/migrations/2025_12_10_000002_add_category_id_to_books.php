<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Add category_id column (nullable for now)
        Schema::table('books', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('deskripsi')->constrained('categories')->nullOnDelete();
        });

        // Step 2: Migrate existing kategori values to categories table
        $existingCategories = DB::table('books')
            ->select('kategori')
            ->distinct()
            ->whereNotNull('kategori')
            ->pluck('kategori');

        foreach ($existingCategories as $categoryName) {
            $slug = Str::slug($categoryName);
            $baseSlug = $slug;
            $count = 1;
            
            while (DB::table('categories')->where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $count;
                $count++;
            }

            DB::table('categories')->insert([
                'name' => $categoryName,
                'slug' => $slug,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Step 3: Update books.category_id based on kategori name
        $categories = DB::table('categories')->get();
        foreach ($categories as $category) {
            DB::table('books')
                ->where('kategori', $category->name)
                ->update(['category_id' => $category->id]);
        }

        // Step 4: Drop the old kategori column
        Schema::table('books', function (Blueprint $table) {
            $table->dropColumn('kategori');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Step 1: Re-add kategori column
        Schema::table('books', function (Blueprint $table) {
            $table->string('kategori')->nullable()->after('deskripsi');
        });

        // Step 2: Restore kategori values from category relationship
        $books = DB::table('books')
            ->join('categories', 'books.category_id', '=', 'categories.id')
            ->select('books.id', 'categories.name')
            ->get();

        foreach ($books as $book) {
            DB::table('books')
                ->where('id', $book->id)
                ->update(['kategori' => $book->name]);
        }

        // Step 3: Drop foreign key and category_id column
        Schema::table('books', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }
};
