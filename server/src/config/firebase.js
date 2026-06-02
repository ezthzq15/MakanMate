const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
try {
  let serviceAccount;
  if (process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  } else {
    serviceAccount = require("./serviceAccountKey.json");
  }
  
  if (!admin.apps.length) {
    admin.initializeApp({ 
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${serviceAccount.projectId || serviceAccount.project_id}.firebasestorage.app`
    });
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