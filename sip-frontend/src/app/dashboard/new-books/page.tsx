import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const books = [
  {
    id: 1,
    title: "Blue Box Vol. 1",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox1.jpeg",
  },
  {
    id: 2,
    title: "Blue Box Vol. 9",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox.jpg",
  },
  {
    id: 3,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    category: "Fantasi",
    coverImage: "/harryp.jpg",
  },
  {
    id: 4,
    title: "Blue Box Vol. 17",
    author: "Kouji Miura",
    category: "Comic",
    coverImage: "/bluebox17.jpeg",
  },
];

export default function NewBooksPage() {
  return (
    <div className="min-h-screen bg-[#F3F6F8] p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4">
        <Link 
          href="/dashboard" 
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-slate-700">Buku Baru Ditambahkan</h1>
           <p className="text-slate-500 text-sm">Daftar koleksi terbaru perpustakaan</p>
        </div>
      </div>

      {/* Grid Buku Full Page */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: any }) {
  return (
    <div className="group relative aspect-[3/4.5] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-200">
      <Image
        src={book.coverImage}
        alt={book.title}
        fill
        className="object-cover transition-transform group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3">
        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-full text-slate-800 uppercase tracking-wide">
          {book.category}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="font-bold text-lg leading-tight mb-1 line-clamp-2 drop-shadow-md">
          {book.title}
        </h3>
        <p className="text-xs text-gray-300 font-medium drop-shadow-md">
          {book.author}
        </p>
      </div>
    </div>
  );
}