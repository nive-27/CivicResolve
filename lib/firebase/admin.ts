import * as admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

export const isFirebaseAdminConfigured = Boolean(
  projectId && clientEmail && privateKey
);

export function getAdminApp(): admin.app.App | null {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  if (isFirebaseAdminConfigured && clientEmail && privateKey) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
      return null;
    }
  }

  // If in local/dev mode without admin credentials, initialize with default projectId
  if (projectId) {
    try {
      return admin.initializeApp({ projectId });
    } catch {
      return null;
    }
  }

  return null;
}

export function getAdminAuth(): admin.auth.Auth | null {
  const app = getAdminApp();
  return app ? admin.auth(app) : null;
}

export function getAdminFirestore(): admin.firestore.Firestore | null {
  const app = getAdminApp();
  return app ? admin.firestore(app) : null;
}
