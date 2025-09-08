
import BookForm from "@/components/books/BookForm";

interface BookEditPageProps {
  params: {
    id: string;
  };
}

export default  function BookEditPage({ params }: BookEditPageProps) {
  return <BookForm bookId={params.id} />;
}
