"use client";
import { useState } from "react";
import { ArrowLeft, Calendar, User, BookOpen, Hash, Edit } from "lucide-react";
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
    if (
      !borrowQuantity ||
      borrowQuantity < 1 ||
      !Number.isInteger(borrowQuantity)
    ) {
      setMessage("จำนวนที่ต้องการยืมต้องเป็นตัวเลขเต็มที่มากกว่า 0");
      return;
    }

    if (borrowQuantity > book.availableQuantity) {
      setMessage("ไม่สามารถยืมได้เกินจำนวนที่มีอยู่");
      return;
    }

    setLoading(true);
    try {
      await borrowBook(book.id, borrowQuantity);
      setMessage(`ยืมหนังสือ ${borrowQuantity} เล่มสำเร็จ`);
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "เกิดข้อผิดพลาดในการยืมหนังสือ");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (
      !returnQuantity ||
      returnQuantity < 1 ||
      !Number.isInteger(returnQuantity)
    ) {
      setMessage("จำนวนที่ต้องการคืนต้องเป็นตัวเลขเต็มที่มากกว่า 0");
      return;
    }

    setLoading(true);
    try {
      await returnBook(book.id, returnQuantity);
      setMessage(`คืนหนังสือ ${returnQuantity} เล่มสำเร็จ`);
      router.refresh();
    } catch (error: any) {
      setMessage(error.message || "เกิดข้อผิดพลาดในการคืนหนังสือ");
    } finally {
      setLoading(false);
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
          <span>กลับไปหน้า Library</span>
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
                {book.availableQuantity > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        จำนวนที่ต้องการยืม:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={book.availableQuantity}
                        value={borrowQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          setBorrowQuantity(
                            Math.max(1, Math.min(value, book.availableQuantity))
                          );
                        }}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <button
                      onClick={handleBorrow}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {loading ? "กำลังยืม..." : "ยืมหนังสือ"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleReserve}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    จองหนังสือ
                  </button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    สถานะ:
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      book.availableQuantity > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.availableQuantity > 0 ? "พร้อมให้ยืม" : "ถูกยืมแล้ว"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    จำนวนที่มี:
                  </span>
                  <span className="text-sm text-gray-600">
                    {book.availableQuantity}/{book.totalQuantity} เล่ม
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  คืนหนังสือ
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={returnQuantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setReturnQuantity(Math.max(1, value));
                    }}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={handleReturn}
                    disabled={loading}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    {loading ? "กำลังคืน..." : "คืนหนังสือ"}
                  </button>
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
                <span className="font-medium">ผู้เขียน:</span>
                <span>{book.author}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">ปีที่พิมพ์:</span>
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
                รายละเอียดหนังสือ
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
