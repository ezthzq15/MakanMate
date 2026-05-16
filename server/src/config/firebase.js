const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
try {
  const serviceAccount = require("./serviceAccountKey.json");
  
  if (!admin.apps.length) {
    admin.initializeApp({ 
      credential: admin.credential.cert(serviceAccount),
      // storageBucket: `${serviceAccount.project_id}.appspot.com`
      storageBucket: `${serviceAccount.project_id}.firebasestorage.app`
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