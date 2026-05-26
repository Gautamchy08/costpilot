// Firebase Admin SDK — server-side only
// Used by: API routes, server components
// Never import in 'use client' files

import * as admin from "firebase-admin";
import type { App } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";

let _app: App | undefined;
let _db: Firestore | undefined;

function getApp(): App {
  if (_app) return _app;

  // Already initialized (e.g. Next.js hot reload)
  if (admin.apps.length > 0) {
    _app = admin.apps[0]!;
    return _app;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey && projectId) {
    _app = admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    // Local dev fallback — works with ADC or project ID
    _app = admin.initializeApp({ projectId });
  }

  return _app;
}

export function getAdminDb(): Firestore {
  if (_db) return _db;
  const app = getApp();
  _db = admin.firestore(app);
  return _db;
}
