import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit, 
  doc, 
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  authorId: string;
  category: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Book {
  id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  coverImage: string;
  previewImages: string[];
  storeUrl: string;
  published: boolean;
  order: number;
  createdAt?: Date;
}

// --- Posts ---

export const getPublishedPosts = async (limitCount = 10): Promise<Post[]> => {
  const path = 'posts';
  try {
    const q = query(
      collection(db, path),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Post));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createPost = async (post: Omit<Post, 'id' | 'createdAt'>) => {
  const path = 'posts';
  try {
    return await addDoc(collection(db, path), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

// --- Books ---

export const getPublishedBooks = async (): Promise<Book[]> => {
  const path = 'books';
  try {
    const q = query(
      collection(db, path),
      where('published', '==', true),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Book));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createBook = async (book: Omit<Book, 'id' | 'createdAt'>) => {
  const path = 'books';
  try {
    return await addDoc(collection(db, path), {
      ...book,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};
