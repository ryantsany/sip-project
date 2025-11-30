<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\ResponseFormatter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BookController extends Controller
{
    public function addNewBook(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'judul' => 'required|string|max:255',
            'cover_img' => 'nullable|image|max:2048',
            'penulis' => 'required|string|max:255',
            'penerbit' => 'required|string|max:255',
            'tahun' => 'required|integer|between:1900,' . date('Y'),
            'isbn' => 'required|string|unique:books',
            'deskripsi' => 'nullable|string',
            'kategori' => 'nullable|string',
            'jumlah' => 'required|integer|min:1',
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
            'pengarang' => $request->penulis,
            'penerbit' => $request->penerbit,
            'tahun' =>  $request->tahun,
            'isbn' => $request->isbn,
            'deskripsi' => $request->deskripsi,
            'kategori' => $request->kategori,
            'jumlah' => $request->jumlah,
            'stok' => $request->jumlah,
            'status' => $request->status,
        ]);

        return ResponseFormatter::success([
            'book' => $book
        ], [
            'Buku berhasil ditambahkan'
        ]);
    }

    public function editBook(Request $request, $slug){
        $validator = Validator::make($request->all(),[
            'judul' => 'sometimes|required|string|max:255',
            'cover_img' => 'sometimes|nullable|image|max:2048',
            'penulis' => 'sometimes|required|string|max:255',
            'penerbit' => 'sometimes|required|string|max:255',
            'tahun' => 'sometimes|required|integer|between:1900,' . date('Y'),
            'isbn' => 'sometimes|required|string',
            'deskripsi' => 'sometimes|nullable|string',
            'kategori' => 'sometimes|nullable|string',
            'jumlah' => 'sometimes|required|integer|min:1',
            'stok' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|string|in:available,unavailable',
        ]);

        if($validator->fails()){
            return ResponseFormatter::error(422, $validator->errors());
        }

        $book = Book::where('slug', $slug)->first();
        if (!$book) {
            return ResponseFormatter::error(404, null, ['Buku tidak ditemukan']);
        }

        $payload = $validator->validated();

        if ($request->hasFile('cover_img')) {
            $coverPath = $request->file('cover_img')->store('covers', 'public');
            $payload['cover_url'] = '/storage/' . $coverPath;
        } else {
            $payload['cover_url'] = null;
        }

        $book->update([
            'judul' => $payload['judul'],
            'cover_url' => $payload['cover_url'],
            'pengarang' => $payload['penulis'],
            'penerbit' => $payload['penerbit'],
            'tahun' => $payload['tahun'],
            'isbn' => $payload['isbn'],
            'deskripsi' => $payload['deskripsi'],
            'kategori' => $payload['kategori'],
            'jumlah' => $payload['jumlah'],
            'stok' => $payload['stok'],
            'status' => $payload['status'],
        ]);

        return ResponseFormatter::success($book->api_response, ['Buku berhasil diperbarui']);
    }

    public function deleteBook($slug){
        $book = Book::where('slug', $slug)->first();
        if (!$book) {
            return ResponseFormatter::error(404, null, ['Buku tidak ditemukan']);
        }

        $book->delete();

        return ResponseFormatter::success(null, ['Buku berhasil dihapus']);
    }

    public function getAllBooks(){
        $books = Book::orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn (Book $book) => $book->api_response);

        return ResponseFormatter::success($books);
    }

    public function getFourLatestBooks(){
        $books = Book::orderBy('created_at', 'desc')
            ->take(4)
            ->get()
            ->map(fn (Book $book) => $book->api_response);

        return ResponseFormatter::success($books);
    }

    public function getBookDetails($slug){
        $book = Book::where('slug', $slug)->first();

        if (!$book) {
            return ResponseFormatter::error(404, null, ['Buku tidak ditemukan']);
        }

        return ResponseFormatter::success($book->api_response);
    }

    public function searchBooks(Request $request){
        $query = $request->input('query');

        $books = Book::where('judul', 'like', '%' . $query . '%')
            ->orWhere('kategori', 'like',   $query)
            ->orWhere('isbn', 'like', '%' . $query . '%')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(fn (Book $book) => $book->api_response);

        return ResponseFormatter::success($books);
    }
}
