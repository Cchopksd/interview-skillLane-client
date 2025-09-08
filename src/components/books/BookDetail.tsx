"use client";
import { useState } from "react";
import { ArrowLeft, Calendar, User, BookOpen, Star, Clock } from "lucide-react";
import { Book } from "@/interfaces/book";
import { borrowBook, returnBook } from "@/actions/books";
import { useRouter } from "next/navigation";

interface BookDetailProps {
  book: Book;
}

export default function BookDetail({ book }: BookDetailProps) {
  const router = useRouter();
  const [borrowQuantity, setBorrowQuantity] = useState(1);
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBorrow = async () => {
    if (borrowQuantity > book.availableQuantity) {
      setMessage("ไม่สามารถยืมได้เกินจำนวนที่มีอยู่");
      return;
    }

    setLoading(true);
    try {
      await borrowBook(book.id, borrowQuantity);
      setMessage(`ยืมหนังสือ ${borrowQuantity} เล่มสำเร็จ`);
      // Refresh the page to update availability
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "เกิดข้อผิดพลาดในการยืมหนังสือ");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);
    try {
      await returnBook(book.id, returnQuantity);
      setMessage(`คืนหนังสือ ${returnQuantity} เล่มสำเร็จ`);
      // Refresh the page to update availability
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "เกิดข้อผิดพลาดในการคืนหนังสือ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปยังห้องสมุด
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Book Cover */}
          <div className="md:w-1/3">
            <div className="h-96 md:h-full bg-gray-100 flex items-center justify-center">
              {book.coverImage ? (
                <img
                  src={book.coverImage.url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen className="w-24 h-24 text-gray-400" />
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {book.title}
            </h1>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-lg text-gray-700">
                  <strong>ผู้เขียน:</strong> {book.author}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-lg text-gray-700">
                  <strong>ปีที่พิมพ์:</strong> {book.publicationYear}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span className="text-lg text-gray-700">
                  <strong>ISBN:</strong> {book.ISBN}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-lg text-gray-700">
                  <strong>จำนวนทั้งหมด:</strong> {book.totalQuantity} เล่ม
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gray-500" />
                <span className="text-lg text-gray-700">
                  <strong>จำนวนที่เหลือ:</strong> {book.availableQuantity} เล่ม
                </span>
              </div>
            </div>

            {book.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  เรื่องย่อ
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Availability Status */}
            <div className="mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  book.availableQuantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {book.availableQuantity > 0 ? "พร้อมให้ยืม" : "ไม่พร้อมให้ยืม"}
              </span>
            </div>

            {/* Borrow/Return Actions */}
            {book.availableQuantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    จำนวนที่ต้องการยืม:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={book.availableQuantity}
                    value={borrowQuantity}
                    onChange={(e) => setBorrowQuantity(Number(e.target.value))}
                    className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleBorrow}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "กำลังยืม..." : "ยืมหนังสือ"}
                  </button>
                </div>
              </div>
            )}

            {/* Return Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                คืนหนังสือ
              </h3>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  จำนวนที่ต้องการคืน:
                </label>
                <input
                  type="number"
                  min="1"
                  value={returnQuantity}
                  onChange={(e) => setReturnQuantity(Number(e.target.value))}
                  className="w-20 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleReturn}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังคืน..." : "คืนหนังสือ"}
                </button>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
