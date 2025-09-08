"use client";
import { BookOpen, Star } from "lucide-react";
import { Book } from "@/interfaces/book";

interface BookListItemProps {
  book: Book;
}

export default function BookListItem({ book }: BookListItemProps) {
  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50">
      <div className="flex items-center gap-4">
        <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          {book.coverImage ? (
            <img
              src={book.coverImage.url}
              alt={book.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <BookOpen className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold mb-1">{book.title}</h3>
          <p className="text-gray-600 text-sm mb-1">{book.author}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>ISBN: {book.ISBN}</span>
            <span>{book.publicationYear}</span>
            <span>
              Available: {book.availableQuantity}/{book.totalQuantity}
            </span>
          </div>
          {book.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {book.description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <span
            className={`text-sm px-3 py-1 rounded ${
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
