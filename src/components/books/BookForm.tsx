"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Book } from "@/interfaces/book";
import { createBook, updateBook, getBookById } from "@/actions/books";
import { useRouter } from "next/navigation";

interface BookFormProps {
  bookId?: string;
}

export default function BookForm({ bookId }: BookFormProps) {
  const router = useRouter();
  const isEditMode = !!bookId;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    ISBN: "",
    publicationYear: new Date().getFullYear(),
    totalQuantity: 1,
  });

  useEffect(() => {
    if (isEditMode && bookId) {
      const loadBook = async () => {
        try {
          const book = await getBookById(bookId);
          setFormData({
            title: book.title,
            author: book.author,
            description: book.description,
            ISBN: book.ISBN,
            publicationYear: book.publicationYear,
            totalQuantity: book.totalQuantity,
          });
          if (book.coverImage?.url) {
            setPreview(book.coverImage.url);
          }
        } catch (error) {
          setMessage("Failed to load book details");
        } finally {
          setInitialLoading(false);
        }
      };

      loadBook();
    }
  }, [bookId, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "publicationYear" || name === "totalQuantity"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files.length > 1) {
        setMessage("Please select only one image");
        return;
      }

      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setMessage("Please select a valid image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setMessage("Image size must be less than 10MB");
        return;
      }

      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setMessage("");
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (!formData.title.trim()) {
        setMessage("Title is required");
        return;
      }
      if (!formData.author.trim()) {
        setMessage("Author is required");
        return;
      }
      if (!formData.ISBN.trim()) {
        setMessage("ISBN is required");
        return;
      }
      if (
        formData.publicationYear < 1000 ||
        formData.publicationYear > new Date().getFullYear() + 1
      ) {
        setMessage("Please enter a valid publication year");
        return;
      }
      if (formData.totalQuantity < 1) {
        setMessage("Total quantity must be at least 1");
        return;
      }

      const imageFile =
        coverImage || new File([], "placeholder.jpg", { type: "image/jpeg" });

      const bookData: Book = {
        id: bookId || "",
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        ISBN: formData.ISBN.trim(),
        publicationYear: formData.publicationYear,
        totalQuantity: formData.totalQuantity,
        availableQuantity: formData.totalQuantity,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverImage: {
          url: "",
          path: "",
        },
      };

      if (isEditMode && bookId) {
        await updateBook(bookId, bookData, imageFile);
        setMessage("Book updated successfully!");
        router.push(`/library/${bookId}`);
      } else {
        await createBook(bookData, imageFile);
        setMessage("Book created successfully!");
        router.push("/library");
      }
    } catch (error: any) {
      setMessage(
        error.message || `Failed to ${isEditMode ? "update" : "create"} book`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading book details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors hover:cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to {isEditMode ? "Book Details" : "Library"}</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Book" : "Add New Book"}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                name="ISBN"
                value={formData.ISBN}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ISBN"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Year *
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                min="1000"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Quantity *
              </label>
              <input
                type="number"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter book description"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cover Image
          </h2>

          <div className="space-y-4">
            {preview && (
              <div className="relative w-48 h-64 mx-auto">
                <img
                  src={preview}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-center">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG or JPEG (MAX. 10MB) - One image only
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple={false}
                />
              </label>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {loading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Book"
              : "Create Book"}
          </button>
        </div>
      </form>
    </div>
  );
}
