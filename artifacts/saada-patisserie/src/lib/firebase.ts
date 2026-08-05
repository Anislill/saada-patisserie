import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/** Strip surrounding quotes and trailing commas that appear when secrets
 *  are copy-pasted directly from a Firebase config object literal. */
function clean(value: string | undefined): string {
  if (!value) return '';
  return value.trim().replace(/^["']|["'],?$/g, '').trim();
}

const firebaseConfig = {
  apiKey:            clean(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain:        clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId:         clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket:     clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId:             clean(import.meta.env.VITE_FIREBASE_APP_ID),
};

// Primary app — used by customers (auth + Firestore)
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Secondary app — used exclusively by admin login so admin sessions
// never overwrite the customer's Firebase auth state in the store.
const adminAppName = 'admin-app';
export const adminApp =
  getApps().find((a) => a.name === adminAppName) ??
  initializeApp(firebaseConfig, adminAppName);
export const adminAuth = getAuth(adminApp);
