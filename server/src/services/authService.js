const admin = require('firebase-admin');
const db = require('../config/firebase');

/**
 * Register a new user using Firebase Admin SDK and save user profile to Firestore
 */
const registerUser = async (email, password, displayName, preferences = {}) => {
  try {
    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // 2. Create user document in Firestore (Model layer equivalent)
    const userDoc = {
      email,
      displayName,
      preferences, // e.g., halal, budget, cuisine
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(userRecord.uid).set(userDoc);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      message: 'User registered successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Login user using Firebase REST API and return idToken
 * (Firebase Admin doesn't support password sign-in natively)
 */
const loginUser = async (email, password) => {
  try {
    // Requires FIREBASE_API_KEY in .env (Web API Key from Firebase Console)
    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      throw new Error('FIREBASE_API_KEY is missing in environment variables');
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || 'Login failed');
    }

    return {
      uid: data.localId,
      email: data.email,
      idToken: data.idToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
