import admin from 'firebase-admin';
import { logger } from '../utils/logger.js';

export const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}'
    );

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    }

    logger.info('✅ Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('❌ Firebase Admin initialization error:', error);
    // Don't exit process in development if Firebase keys are not set
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification error:', error);
    throw new Error('Invalid token');
  }
};