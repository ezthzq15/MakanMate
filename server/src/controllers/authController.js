const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    if (!userName || !userEmail || !userPassword) return res.status(400).json({ error: 'Name, email, and password are required' });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) return res.status(400).json({ error: 'Invalid email format' });
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(userPassword)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, number and special character.' });
    }

    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('userEmail', '==', userEmail).get();
    if (!existingUser.empty) return res.status(400).json({ error: 'Email already exists' });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

    const newUser = { 
        userName, 
        userEmail, 
        userPassword: hashedPassword, 
        userRole: 'user', 
        accountStatus: 0,
        lastLoginAt: null,
        preferenceID: "",
        userPhone: "",
        createdAt: new Date().toISOString() 
    };
    const docRef = await usersRef.add(newUser);

    return res.status(201).json({ message: 'User registered successfully', user: { userID: docRef.id, userName, userEmail, userRole: 'user' } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) return res.status(400).json({ error: 'Email and password are required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('userEmail', '==', userEmail).get();

    if (snapshot.empty) return res.status(401).json({ error: 'Email not found' });

    let userDoc;
    let userData;
    snapshot.forEach(doc => { userDoc = doc; userData = doc.data(); });

    const isPasswordValid = await bcrypt.compare(userPassword, userData.userPassword);
    if (!isPasswordValid) return res.status(401).json({ error: 'Incorrect password' });

    // ── Account Status Gate ──────────────────────────────────────────────────
    // accountStatus: 0 = Active, 1 = Not Active, 2 = Suspended
    const accountStatus = userData.accountStatus !== undefined ? userData.accountStatus : 0;

    if (accountStatus === 2) {
      return res.status(403).json({ error: 'ACCOUNT_SUSPENDED' });
    }

    // Detect inactivity: if Active (0) but last login was >30 days ago, mark as Not Active
    let wasInactive = false;
    const now = new Date();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    if (accountStatus === 1) {
      // Was already flagged Not Active — re-activate
      wasInactive = true;
    } else if (accountStatus === 0 && userData.lastLoginAt) {
      const lastLogin = new Date(userData.lastLoginAt);
      if (now - lastLogin > THIRTY_DAYS_MS) {
        wasInactive = true;
      }
    }

    // Write lastLoginAt + re-activate if needed
    const updatePayload = { lastLoginAt: now.toISOString() };
    if (wasInactive) updatePayload.accountStatus = 0;
    await db.collection('users').doc(userDoc.id).update(updatePayload);
    // ────────────────────────────────────────────────────────────────────────

    const payload = {
        userID: userDoc.id,
        userEmail: userData.userEmail,
        userRole: userData.userRole || 'user',
        userName: userData.userName,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: payload,
      wasInactive,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userID = req.user.userID;
    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    const data = doc.data();
    return res.status(200).json({
      userID: doc.id,
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole || 'user',
      profilePic: data.profilePic || null
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ error: 'Internal server error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { userName, userPassword, profilePic } = req.body;

    if (!userName || userName.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updateData = { userName };
    if (profilePic !== undefined) {
      updateData.profilePic = profilePic;
    }

    if (userPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(userPassword)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, number and special character.' });
      }
      const saltRounds = 10;
      updateData.userPassword = await bcrypt.hash(userPassword, saltRounds);
    }

    const userRef = db.collection('users').doc(userID);
    await userRef.update(updateData);

    const updatedDoc = await userRef.get();
    const updatedData = updatedDoc.data();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        userName: updatedData.userName,
        userEmail: updatedData.userEmail,
        profilePic: updatedData.profilePic || null
      }
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ error: 'Internal server error updating profile' });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };
