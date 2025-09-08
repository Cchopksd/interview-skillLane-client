import { getBooks } from "@/actions/books";
import LibraryClient from "@/components/books/LibraryClient";

export default async function LibraryPage() {
  const { books, meta } = await getBooks({ page: 1, limit: 10, search: "" });

  return <LibraryClient initialBooks={books} initialMeta={meta} />;
}
