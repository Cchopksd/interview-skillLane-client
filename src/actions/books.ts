"use server";
import { Book } from "@/interfaces/book";
import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";

export async function getBooks({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  });
  const response = await apiFetch(`/v1/books?${params}`, {
    method: "GET",
  });
  return {
    books: response.data.data,
    meta: response.data.meta,
  };
}

export async function getBookById(id: string) {
  const response = await apiFetch(`/v1/books/${id}`);
  return response.data;
}

export async function createBook(book: Book, coverImage: File) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const formData = new FormData();
  formData.append("title", book.title);
  formData.append("description", book.description);
  formData.append("author", book.author);
  formData.append("totalQuantity", book.totalQuantity.toString());
  formData.append("ISBN", book.ISBN);
  formData.append("publicationYear", book.publicationYear.toString());
  formData.append("cover", coverImage);
  const response = await apiFetch("/v1/books", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateBook(id: string, book: Book, coverImage: File) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const formData = new FormData();
  formData.append("title", book.title);
  formData.append("description", book.description);
  formData.append("author", book.author);
  formData.append("totalQuantity", book.totalQuantity.toString());
  formData.append("ISBN", book.ISBN);
  formData.append("publicationYear", book.publicationYear.toString());
  formData.append("coverImage", coverImage);
  const response = await apiFetch(`/v1/books/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteBook(id: string) {
  const response = await apiFetch(`/v1/books/${id}`, {
    method: "DELETE",
  });
  return response.data;
}

export async function borrowBook(id: string, qty: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await apiFetch(`/v1/books/${id}/borrow`, {
    method: "POST",
    body: JSON.stringify({ qty }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function returnBook(id: string, qty: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const response = await apiFetch(`/v1/books/${id}/return`, {
    method: "POST",
    body: JSON.stringify({ qty }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
