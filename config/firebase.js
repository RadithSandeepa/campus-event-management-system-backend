import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const { 
  FIREBASE_PROJECT_ID, 
  FIREBASE_CLIENT_EMAIL, 
  FIREBASE_PRIVATE_KEY, 
  FIREBASE_STORAGE_BUCKET 
} = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_STORAGE_BUCKET) {
  throw new Error("Missing required Firebase environment variables.");
}

const serviceAccount = {
  projectId: FIREBASE_PROJECT_ID,
  clientEmail: FIREBASE_CLIENT_EMAIL,
  privateKey: FIREBASE_PRIVATE_KEY,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();
