import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const getEnv = (key: string) => {
  if (typeof process !== 'undefined' && process.env[key]) return process.env[key];
  if (typeof process !== 'undefined' && process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];
  // @ts-ignore
  const metaEnv = import.meta.env;
  if (metaEnv) {
    return metaEnv[key] || metaEnv[`VITE_${key}`];
  }
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv('FIREBASE_API_KEY'),
  authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('FIREBASE_APP_ID'),
};

// التحقق مما إذا كانت الإعدادات صالحة وليست مجرد قيم افتراضية
export const isConfigValid = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'xxxx' && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'xxxx'
);

// تهيئة التطبيق فقط إذا كانت الإعدادات موجودة وصحيحة لتجنب FirebaseError المزعج
let app;
if (isConfigValid) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

// تصدير الخدمات بشكل آمن، ستكون null في حال عدم صلاحية الإعدادات
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
