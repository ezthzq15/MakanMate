const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_CONFIG || process.env.FUNCTION_TARGET) {
      // Automatic initialization when deployed to Firebase Cloud Functions
      // storageBucket must be specified explicitly — auto-init does not set a default bucket
      const projectId = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.FB_PROJECT_ID;
      admin.initializeApp({
        storageBucket: projectId ? `${projectId}.firebasestorage.app` : undefined
      });
    } else {
      // Local development or generic hosting configuration
      let serviceAccount;
      const privateKey = process.env.FB_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
      const projectId = process.env.FB_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FB_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;

      if (privateKey) {
        serviceAccount = {
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        };
      } else {
        serviceAccount = require("./serviceAccountKey.json");
      }

      admin.initializeApp({ 
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `${serviceAccount.projectId || serviceAccount.project_id}.firebasestorage.app`
      });
    }
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// Storage is optional — gracefully skip if bucket is not configured
let storage = null;
try {
  storage = admin.storage().bucket();
} catch (err) {
  console.warn("Firebase Storage not available:", err.message);
}

module.exports = { admin, db, storage, FieldValue };