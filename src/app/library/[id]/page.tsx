'use client'
import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, BookOpen, Hash, Heart, Share2, Star } from 'lucide-react';

const BookDetailUI = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedBook, setSelectedBook] = useState('cleanCode'); // สำหรับ demo

  // Mock data - ในการใช้งานจริงจะมาจาก API parameter
  const booksData = {
    cleanCode: {
      id: 1,
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way. Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code: A Handbook of Agile Software Craftsmanship. Martin has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code 'on the fly' into a book that will instill within you the values of a software craftsman and make you a better programmer—but only if you work at it.",
      isbn: "978-0132350884",
      author: "Robert C. Martin",
      publicationYear: 2008,
      coverImage: "/api/placeholder/300/450",
      rating: 4.5,
      totalRatings: 2847,
      status: "Available",
      category: "Programming",
      pages: 464,
      language: "English",
      publisher: "Prentice Hall",
      availableCopies: 3,
      totalCopies: 5,
      tags: ["Software Engineering", "Best Practices", "Agile", "Code Quality"]
    },
    designPatterns: {
      id: 2,
      title: "Design Patterns: Elements of Reusable Object-Oriented Software",
      description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems. Previously undocumented, these 23 patterns allow designers to create more flexible, elegant, and ultimately reusable designs without having to rediscover the design solutions themselves.",
      isbn: "978-0201633612",
      author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
      publicationYear: 1994,
      coverImage: "/api/placeholder/300/450",
      rating: 4.8,
      totalRatings: 1923,
      status: "Borrowed",
      category: "Programming",
      pages: 395,
      language: "English",
      publisher: "Addison-Wesley",
      availableCopies: 0,
      totalCopies: 2,
      tags: ["Design Patterns", "OOP", "Software Architecture", "Gang of Four"]
    }
  };

  const currentBook = booksData[selectedBook as keyof typeof booksData];

  const handleBack = () => {
    console.log('Navigate back to library');
  };

  const handleBorrow = () => {
    console.log('Borrow book:', currentBook.title);
  };

  const handleReserve = () => {
    console.log('Reserve book:', currentBook.title);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const handleShare = () => {
    console.log('Share book:', currentBook.title);
  };

  const RatingStars = ({ rating, size = "w-4 h-4" }: { rating: number, size?: string }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${size} ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-200 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Book Cover */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Cover Image */}
              <div className="w-full aspect-[2/3] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-400" />
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                {currentBook.status === 'Available' ? (
                  <button
                    onClick={handleBorrow}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    ยืมหนังสือ
                  </button>
                ) : (
                  <button
                    onClick={handleReserve}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    จองหนังสือ
                  </button>
                )}
              </div>

              {/* Availability Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">สถานะ:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    currentBook.status === 'Available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentBook.status === 'Available' ? 'พร้อมให้ยืม' : 'ถูกยืมแล้ว'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">จำนวนที่มี:</span>
                  <span className="text-sm text-gray-600">
                    {currentBook.availableCopies}/{currentBook.totalCopies} เล่ม
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Book Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              {currentBook.title}
            </h1>

         
            {/* Author and Publication Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">ผู้เขียน:</span>
                <span>{currentBook.author}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="font-medium">ปีที่พิมพ์:</span>
                <span>{currentBook.publicationYear}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium">ISBN:</span>
                <span className="font-mono text-sm">{currentBook.isbn}</span>
              </div>
            
            </div>

          </div>

          {/* Description */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">รายละเอียดหนังสือ</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-justify">
                {currentBook.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailUI;  