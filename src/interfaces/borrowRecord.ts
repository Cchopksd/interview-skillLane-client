export type BorrowRecord = {
  id: string;
  user: {
    id: string;
    username: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
  };
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
