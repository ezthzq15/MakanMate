const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const registerUser = async (req, res) => {
  try {
    const { displayName, email, password } = req.body;
    const name = displayName || req.body.name;

    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });

    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email).get();
    if (!existingUser.empty) return res.status(400).json({ error: 'Email already exists' });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = { 
        name, 
        email, 
        password: hashedPassword, 
        role: 'user', // ADDED: default role assigned
        createdAt: new Date().toISOString() 
    };
    const docRef = await usersRef.add(newUser);

    return res.status(201).json({ message: 'User registered successfully', user: { id: docRef.id, name, email, role: 'user' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) return res.status(401).json({ error: 'Email not found' });

    let userDoc;
    let userData;
    snapshot.forEach(doc => { userDoc = doc; userData = doc.data(); });

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) return res.status(401).json({ error: 'Incorrect password' });

    // JWT Implementation
    const payload = {
        id: userDoc.id,
        email: userData.email,
        role: userData.role || 'user'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

module.exports = { registerUser, loginUser };
