import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  addDoc
} from "firebase/firestore";

export const DBService = {
  async getCollection(path: string) {
    const colRef = collection(db, path);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async setDocument(path: string, id: string, data: any) {
    const docRef = doc(db, path, id);
    return setDoc(docRef, data, { merge: true });
  },

  async getDocument(path: string, id: string) {
    const docRef = doc(db, path, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  },

  async removeDocument(path: string, id: string) {
    const docRef = doc(db, path, id);
    return deleteDoc(docRef);
  },

  // Helpers for generic saving (compatible with previous structure if needed)
  save: (key: string, data: any) => {
    // Local backup for fallback
    localStorage.setItem(`darspay_v4_${key}`, JSON.stringify(data));
  },
  
  get: (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(`darspay_v4_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  }
};