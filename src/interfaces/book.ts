export type Book = {
  id: string;
  title: string;
  description: string;
  ISBN: string;
  author: string;
  publicationYear: number;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: Date;
  updatedAt: Date;
  coverImage: {
    url: string;
    path: string;
  };
};
