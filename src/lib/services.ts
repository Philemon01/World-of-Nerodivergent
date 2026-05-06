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
  setDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { User, sendPasswordResetEmail } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, handleFirestoreError, OperationType } from './firebase';

// --- Storage ---

export const uploadFile = async (file: File, folder: string): Promise<string> => {
  if (!storage) return '';
  try {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  role: 'admin' | 'moderator' | 'content_creator' | 'user';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Purchase {
  id?: string;
  userId: string;
  itemId: string;
  itemType: 'book';
  purchaseDate: Date;
}

// --- Users ---

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'progressphilemon@gmail.com';

export const syncUserProfile = async (user: User) => {
  if (!db) return;
  const path = `users/${user.uid}`;
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        role: user.email === ADMIN_EMAIL ? 'admin' : 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) return null;
  const path = `users/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'users', uid));
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || undefined
    } as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};


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
  author: string;
  price: number;
  currency: string;
  coverImage: string;
  previewImages: string[];
  storeUrl: string;
  published: boolean;
  order: number;
  createdAt?: Date;
}

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  if (!db) return;
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const sendPasswordRest = async (email: string) => {
  if (!auth) return;
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

// --- Posts ---

export const getPublishedPosts = async (limitCount = 10): Promise<Post[]> => {
  if (!db) return [];
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
  if (!db) return;
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

export const updatePost = async (id: string, post: Partial<Post>) => {
  if (!db) return;
  const path = `posts/${id}`;
  try {
    const docRef = doc(db, 'posts', id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deletePost = async (id: string) => {
  if (!db) return;
  const path = `posts/${id}`;
  try {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
  if (!db) return [];
  const path = 'posts';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
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

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!db) return null;
  const path = 'posts';
  try {
    const q = query(
      collection(db, path),
      where('slug', '==', slug),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Post;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};

// --- Books ---

export const getPublishedBooks = async (): Promise<Book[]> => {
  if (!db) return [];
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
  if (!db) return;
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

export const updateBook = async (id: string, book: Partial<Book>) => {
  if (!db) return;
  const path = `books/${id}`;
  try {
    const docRef = doc(db, 'books', id);
    await updateDoc(docRef, book);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteBook = async (id: string) => {
  if (!db) return;
  const path = `books/${id}`;
  try {
    const docRef = doc(db, 'books', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
  if (!db) return [];
  const path = 'books';
  try {
    const q = query(collection(db, path), orderBy('order', 'asc'));
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

// --- Purchases ---

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  if (!db) return [];
  const path = 'purchases';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      purchaseDate: (doc.data().purchaseDate as Timestamp)?.toDate() || new Date()
    } as Purchase));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  if (!db) return null;
  const path = `books/${id}`;
  try {
    const docSnap = await getDoc(doc(db, 'books', id));
    if (!docSnap.exists()) return null;
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: (docSnap.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Book;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
};
