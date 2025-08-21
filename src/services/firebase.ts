import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getCrashlytics, Crashlytics } from 'firebase/crashlytics';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let crashlytics: Crashlytics | null = null;

export const initializeFirebase = (): { app: FirebaseApp; db: Firestore; analytics: Analytics | null; crashlytics: Crashlytics | null } => {
  if (app && db) {
    return { app, db, analytics, crashlytics };
  }

  const config: Partial<FirebaseConfig> = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const missing: string[] = [];
  if (!config.apiKey) missing.push('VITE_FIREBASE_API_KEY');
  if (!config.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!config.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!config.appId) missing.push('VITE_FIREBASE_APP_ID');
  if (!config.measurementId) missing.push('VITE_FIREBASE_MEASUREMENT_ID');

  if (missing.length) {
    console.warn('Missing Firebase env vars:', missing);
  }

  app = getApps().length ? getApps()[0] : initializeApp(config as FirebaseConfig);
  db = getFirestore(app);
  
  // Initialize Analytics (only in browser environment)
  try {
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
      console.log('✅ Firebase Analytics initialized');
    }
  } catch (error) {
    console.warn('⚠️ Analytics initialization failed:', error);
  }
  
  // Initialize Crashlytics (only in browser environment)
  try {
    if (typeof window !== 'undefined') {
      crashlytics = getCrashlytics(app);
      console.log('✅ Firebase Crashlytics initialized');
    }
  } catch (error) {
    console.warn('⚠️ Crashlytics initialization failed:', error);
    crashlytics = null;
  }
  
  return { app, db, analytics, crashlytics };
};

export const getDb = (): Firestore => {
  if (!db) {
    const { db: inited } = initializeFirebase();
    db = inited;
  }
  return db!;
};

export const getAnalytics = (): Analytics | null => {
  if (!analytics) {
    const { analytics: inited } = initializeFirebase();
    analytics = inited;
  }
  return analytics;
};

export const getCrashlytics = (): Crashlytics | null => {
  if (!crashlytics) {
    const { crashlytics: inited } = initializeFirebase();
    crashlytics = inited;
  }
  return crashlytics;
};


