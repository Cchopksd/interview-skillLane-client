"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Book } from "@/interfaces/book";
import SearchFilters from "./SearchFilters";
import Pagination from "./Pagination";
import { getBooks } from "@/actions/books";

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

  const fetchBooks = async (page: number, search: string = searchTerm) => {
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
  };

  const handlePageChange = (page: number) => {
    fetchBooks(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchBooks(1, term);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Library Management
        </h1>
        <p className="text-gray-600">จัดการและค้นหาหนังสือในห้องสมุด</p>
      </div>

      <SearchFilters searchTerm={searchTerm} setSearchTerm={handleSearch} />

      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600">พบหนังสือทั้งหมด {meta.totalItems} เล่ม</p>
        <div className="flex items-center gap-2" />
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
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && books.length === 0 && (
        <div className="text-center flex justify-center py-12">
          <p className="text-gray-600">ไม่พบหนังสือที่ตรงกับการค้นหา</p>
        </div>
      )}
    </div>
  );
}
