const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// MAKE SURE you download your Firebase Service Account JSON file 
// and place it in the server directory, or reference it properly in your .env
try {
  // Actively importing your specific service account key
  const serviceAccount = require("./serviceAccountKey.json");
  
  if (!admin.apps.length) {
    admin.initializeApp({ 
      credential: admin.credential.cert(serviceAccount) 
    });
  }
} catch (error) {
  console.error("Firebase Admin Initialization Error:", error);
}

const db = admin.firestore();

module.exports = { admin, db };