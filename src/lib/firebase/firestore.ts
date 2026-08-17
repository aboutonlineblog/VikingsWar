import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from '@react-native-firebase/firestore';
import { getFirestore } from '@/lib/firebase/initFirebase';

export async function getDocData<T>(collectionName: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(getFirestore(), collectionName, id));
  if (!snap.exists()) {
    return null;
  }
  return snap.data() as T;
}

export async function getCollectionData<T>(collectionName: string): Promise<T[]> {
  const snap = await getDocs(collection(getFirestore(), collectionName));
  return snap.docs.map((entry) => entry.data() as T);
}

export async function getOrderedSubcollection<T>(
  collectionName: string,
  id: string,
  sub: string,
  orderField: string,
  take: number,
): Promise<T[]> {
  const snap = await getDocs(
    query(
      collection(getFirestore(), collectionName, id, sub),
      orderBy(orderField, 'desc'),
      limit(take),
    ),
  );
  return snap.docs.map((entry) => entry.data() as T);
}

export async function addSubcollectionDoc(
  collectionName: string,
  id: string,
  sub: string,
  data: object,
): Promise<void> {
  await addDoc(collection(getFirestore(), collectionName, id, sub), data);
}
