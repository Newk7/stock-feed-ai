import admin from "firebase-admin";
import { env } from "./env.js";

let firebaseApp: admin.app.App | null = null;

export function getFirebaseAuth(): admin.auth.Auth {
  if (!firebaseApp) {
    if (env.FIREBASE_PROJECT_ID && env.FIREBASE_PRIVATE_KEY) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY,
        }),
      });
    } else {
      firebaseApp = admin.initializeApp();
    }
  }
  return admin.auth(firebaseApp);
}
