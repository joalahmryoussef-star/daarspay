import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const AuthService = {
  login(email: string, pass: string) {
    if (!auth) throw new Error("Firebase Auth is not initialized properly.");
    return signInWithEmailAndPassword(auth, email, pass);
  },

  register(email: string, pass: string) {
    if (!auth) throw new Error("Firebase Auth is not initialized properly.");
    return createUserWithEmailAndPassword(auth, email, pass);
  },

  logout() {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  },
};