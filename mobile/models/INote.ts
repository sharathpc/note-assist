export interface INote {
  noteId: string;
  userId: string;
  title: string;
  content: string;
  status: string;
  imageUrl: string | null;
  createdAt: number;
  updatedAt: number;
}
