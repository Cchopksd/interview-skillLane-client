"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Loader2, BookOpen, Plus } from "lucide-react";
import { Book } from "@/interfaces/book";
import BookCard from "./BookCard";
import SearchFilters from "./SearchFilters";
import Pagination from "./Pagination";
import { getBooks } from "@/actions/books";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface LibraryClientProps {
  initialBooks: Book[];
  initialMeta: {
    page: number;
    skip: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export default function LibraryClient({
  initialBooks,
  initialMeta,
}: LibraryClientProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [meta, setMeta] = useState(initialMeta);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchBooks = useCallback(async (page: number, search: string) => {
    setLoading(true);
    try {
      const result = await getBooks({
        page,
        limit: 10,
        search,
      });
      setBooks(result.books);
      setMeta(result.meta);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchBooks]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchBooks(page, searchTerm);
    },
    [fetchBooks, searchTerm]
  );

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Library Management
        </h1>
        <p className="text-gray-600">จัดการและค้นหาหนังสือในห้องสมุด</p>
      </div>

      <SearchFilters searchTerm={searchTerm} setSearchTerm={handleSearch} />

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">พบหนังสือทั้งหมด {meta.totalItems} เล่ม</p>
        <div className="flex items-center gap-2">
          <Link
            href="/library/create"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มหนังสือ
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-center flex justify-center py-8">
          <p className="text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
          </p>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">ไม่พบหนังสือที่ตรงกับการค้นหา</p>
        </div>
      )}
    </div>
  );
}
