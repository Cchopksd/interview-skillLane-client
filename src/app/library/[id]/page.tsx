import { getBookById } from "@/actions/books";
import BookDetail from "@/components/books/BookDetail";
import { notFound } from "next/navigation";

interface BookPageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  try {
    const book = await getBookById(params.id);

    if (!book) {
      notFound();
    }

    return <BookDetail book={book} />;
  } catch (error) {
    console.error("Error fetching book:", error);
    notFound();
  }
}
