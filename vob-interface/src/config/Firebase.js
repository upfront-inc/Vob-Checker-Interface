import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

import authorized from './Authorization';

const firebaseConfigProduction = {
  apiKey: authorized.FIREBASE_API_KEY,
  authDomain: authorized.FIREBASE_AUTH_DOMAIN,
  projectId: authorized.FIREBASE_PROJECT_ID,
  storageBucket: authorized.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: authorized.FIREBASE_MESSAGING_SENDER_ID,
  appId: authorized.FIREBASE_APP_ID,
  measurementId: authorized.FIREBASE_MEASUREMENT_ID,
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfigProduction);
} else {
  firebaseApp = getApp();
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Error setting the auth persistence", error);
  });

export { db, auth, firebaseApp };
