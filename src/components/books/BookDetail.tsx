"use client";
import { useState } from "react";
import { ArrowLeft, Calendar, User, BookOpen, Hash, Edit } from "lucide-react";
import { Book } from "@/interfaces/book";
import { borrowBook, returnBook } from "@/actions/books";
import { useRouter } from "next/navigation";

interface BookDetailProps {
  book: Book;
  userBorrowed: Boolean;
}

export default function BookDetail({ book, userBorrowed }: BookDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAction = async () => {
    if (userBorrowed) {
      // Return book
      setLoading(true);
      try {
        await returnBook(book.id, 1);
        setMessage("Book returned successfully");
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Error occurred while returning the book");
      } finally {
        setLoading(false);
      }
    } else {
      // Borrow book
      if (book.availableQuantity < 1) {
        setMessage("Cannot borrow book as it is not available");
        return;
      }

      setLoading(true);
      try {
        await borrowBook(book.id, 1);
        setMessage("Book borrowed successfully");
        router.refresh();
      } catch (error: any) {
        setMessage(error.message || "Error occurred while borrowing the book");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReserve = () => {
    console.log("Reserve book:", book.title);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors hover:cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Library</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                {book.coverImage ? (
                  <img
                    src={book.coverImage.url}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-gray-400" />
                )}
              </div>

              <div className="mb-4">
                <button
                  onClick={() => router.push(`/library/${book.id}/edit`)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Book Details
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {userBorrowed ? (
                  <button
                    onClick={handleAction}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Returning..." : "Return Book"}
                  </button>
                ) : book.availableQuantity > 0 ? (
                  <button
                    onClick={handleAction}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {loading ? "Borrowing..." : "Borrow Book"}
                  </button>
                ) : (
                  <button
                    onClick={handleReserve}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    All books are borrowed
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Status:
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      book.availableQuantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.availableQuantity > 0
                      ? "Available for borrowing"
                      : "All books are borrowed"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Available:
                  </span>
                  <span className="text-sm text-gray-600">
                    {book.availableQuantity}/{book.totalQuantity} copies
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {book.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Author:</span>
                <span>{book.author}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">Publication Year:</span>
                <span>{book.publicationYear}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium">ISBN:</span>
                <span className="font-mono text-sm">{book.ISBN}</span>
              </div>
            </div>
          </div>

          {book.description && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Book Details
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-justify">
                  {book.description}
                </p>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
