"use client";
import { BookOpen, Star } from "lucide-react";
import { Book } from "@/interfaces/book";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col h-full">
        <div className="w-full h-48 bg-gray-100 rounded mb-3 flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage.url}
              alt={book.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-gray-600 text-xs mb-2">{book.author}</p>

          <div className="text-xs text-gray-500 mb-2">
            <p>ISBN: {book.ISBN}</p>
            <p>Year: {book.publicationYear}</p>
            <p>
              Available: {book.availableQuantity}/{book.totalQuantity}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <span
            className={`text-xs px-2 py-1 rounded ${
              book.availableQuantity > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {book.availableQuantity > 0 ? "Available" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
