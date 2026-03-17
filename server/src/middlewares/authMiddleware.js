const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase ID token
 * Expects header: 'Authorization: Bearer <token>'
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify token using Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Attach user information to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error('Error verifying auth token:', error.message);
    return res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
