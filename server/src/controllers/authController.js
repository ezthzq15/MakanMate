const bcrypt = require('bcrypt');
const { db } = require('../config/firebase');

/**
 * Handle user registration (UC001)
 */
const registerUser = async (req, res) => {
  try {
    const { displayName, email, password } = req.body;
    // Map displayName to name to match frontend payload, fallback to name
    const name = displayName || req.body.name;

    // 1. Validation: All fields required
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // 2. Validation: Email must be valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 3. Validation: Password must be at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // 4. Database: Check if email already exists
    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email).get();

    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 5. Security: Password MUST be hashed using bcrypt (Never store plain password)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 6. Success: Save user in Firestore
    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    const docRef = await usersRef.add(newUser);

    // Return success response
    return res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: docRef.id, name, email } 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

/**
 * Handle user login (UC002)
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation checks
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. Validation: Check if user exists in Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    // Error Handling: If email not found
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Email not found' });
    }

    let userDoc;
    let userData;
    snapshot.forEach(doc => {
      userDoc = doc;
      userData = doc.data();
    });

    // 2. Validation: Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    // Error Handling: If password incorrect
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // 3. Success: Return user basic info (DO NOT implement JWT yet)
    // NOTE: Simulating token response slightly if frontend expects a 'token' field, 
    // but just sending an arbitrary ID as requested by 'basic login only'
    return res.status(200).json({
      message: 'Login successful',
      token: 'basic-auth-dummy-token-' + userDoc.id, // Only here so frontend doesn't break
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

module.exports = { registerUser, loginUser };
