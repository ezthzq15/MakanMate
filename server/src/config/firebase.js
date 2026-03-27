const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// MAKE SURE you download your Firebase Service Account JSON file 
// and place it in the server directory, or reference it properly in your .env
try {
  // If you have a serviceAccountKey.json file:
  // const serviceAccount = require("../../serviceAccountKey.json");
  // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  // Or using application default credentials (if GOOGLE_APPLICATION_CREDENTIALS is set in .env)
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const db = admin.firestore();

module.exports = { admin, db };