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
import { User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from './firebase';

// --- Storage ---

export const uploadFile = async (file: File, folder: string): Promise<string> => {
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
  role: 'admin' | 'moderator' | 'content_creator' | 'user';
  createdAt: Date;
}

export interface Purchase {
  id?: string;
  userId: string;
  itemId: string;
  itemType: 'book' | 'resource';
  purchaseDate: Date;
}

// --- Users ---

export const syncUserProfile = async (user: User) => {
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
        role: user.email === 'progressphilemon@gmail.com' ? 'admin' : 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
  price: number;
  currency: string;
  coverImage: string;
  previewImages: string[];
  storeUrl: string;
  published: boolean;
  order: number;
  createdAt?: Date;
}

export interface Resource {
  id?: string;
  title: string;
  description: string;
  type: 'pdf' | 'guide' | 'checklist' | 'infographic';
  fileUrl: string;
  isFree: boolean;
  published: boolean;
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

export const updatePost = async (id: string, post: Partial<Post>) => {
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
  const path = `posts/${id}`;
  try {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAllPosts = async (): Promise<Post[]> => {
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

export const updateBook = async (id: string, book: Partial<Book>) => {
  const path = `books/${id}`;
  try {
    const docRef = doc(db, 'books', id);
    await updateDoc(docRef, book);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteBook = async (id: string) => {
  const path = `books/${id}`;
  try {
    const docRef = doc(db, 'books', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAllBooks = async (): Promise<Book[]> => {
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

// --- Resources ---

export const getPublishedResources = async (): Promise<Resource[]> => {
  const path = 'resources';
  try {
    const q = query(
      collection(db, path),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Resource));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const createResource = async (resource: Omit<Resource, 'id' | 'createdAt'>) => {
  const path = 'resources';
  try {
    return await addDoc(collection(db, path), {
      ...resource,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateResource = async (id: string, resource: Partial<Resource>) => {
  const path = `resources/${id}`;
  try {
    const docRef = doc(db, 'resources', id);
    await updateDoc(docRef, resource);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteResource = async (id: string) => {
  const path = `resources/${id}`;
  try {
    const docRef = doc(db, 'resources', id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getAllResources = async (): Promise<Resource[]> => {
  const path = 'resources';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
    } as Resource));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

// --- Purchases ---

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
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
