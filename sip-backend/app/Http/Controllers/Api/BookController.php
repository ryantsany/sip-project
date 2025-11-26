<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    public function addNewBook(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'cover_img' => 'nullable|image|max:2048',
            'pengarang' => 'required|string|max:255',
            'penerbit' => 'required|string|max:255',
            'tahun' => 'required|integer|between:1900,' . date('Y'),
            'isbn' => 'required|string|unique:books',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string',
            'tag' => 'nullable|string',
            'jumlah' => 'required|integer|min:1',
            'stok' => 'required|integer|min:0',
            'status' => 'required|string|in:available,unavailable',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $payload = $validator->validated();

        if ($request->hasFile('cover_img')) {
            $coverPath = $request->file('cover_img')->store('covers', 'public');
            $payload['cover_url'] = '/storage/' . $coverPath;
        } else {
            $payload['cover_url'] = null;
        }

        $book = Book::create([
            'judul' => $request->judul,
            'cover_url' => $payload['cover_url'],
            'pengarang' => $request->pengarang,
            'penerbit' => $request->penerbit,
            'tahun' =>  $request->tahun,
            'isbn' => $request->isbn,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'tag' => $request->tag,
            'jumlah' => $request->jumlah,
            'stok' => $request->stok,
            'status' => $request->status
        ]);

        return ResponseFormatter::success([
            'book' => $book
        ], [
            'Book added succesfully'
        ]);
    }

    // Todo: Implement editBook method
    public function editBook(Request $request)
    {

    }
}
