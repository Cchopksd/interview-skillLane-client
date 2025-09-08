import { getBookById, getUserBorrowHistoryForBook } from "@/actions/books";
import BookDetail from "@/components/books/BookDetail";
import { notFound } from "next/navigation";

interface BookPageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  try {
    const { id } = await params;

    const book = getBookById(id);
    const userBorrowed = getUserBorrowHistoryForBook(id);

    const [bookData, userBorrowedData] = await Promise.all([
      book,
      userBorrowed,
    ]);

    if (!book) {
      notFound();
    }

    return <BookDetail book={bookData} userBorrowed={userBorrowedData} />;
  } catch (error) {
    console.error("Error fetching book:", error);
    notFound();
  }
}
