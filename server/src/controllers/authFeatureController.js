const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');
const emailService = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    if (!userName || !userEmail || !userPassword) return res.status(400).json({ error: 'Name, email, and password are required' });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) return res.status(400).json({ error: 'Invalid email format' });
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
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

    const accountStatus = userData.accountStatus !== undefined ? userData.accountStatus : 0;

    if (accountStatus === 2) {
      return res.status(403).json({ error: 'ACCOUNT_SUSPENDED' });
    }

    let wasInactive = false;
    const now = new Date();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

    if (accountStatus === 1) {
      wasInactive = true;
    } else if (accountStatus === 0 && userData.lastLoginAt) {
      const lastLogin = new Date(userData.lastLoginAt);
      if (now - lastLogin > THIRTY_DAYS_MS) {
        wasInactive = true;
      }
    }

    const updatePayload = { lastLoginAt: now.toISOString() };
    if (wasInactive) updatePayload.accountStatus = 0;
    await db.collection('users').doc(userDoc.id).update(updatePayload);

    const payload = {
        userID: userDoc.id,
        userEmail: userData.userEmail,
        userRole: userData.userRole || 'user',
        userName: userData.userName,
        forcePasswordChange: userData.forcePasswordChange || false
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

const changePassword = async (req, res) => {
  try {
    const userID = req.user.userID;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    const userData = doc.data();
    const isPasswordValid = await bcrypt.compare(currentPassword, userData.userPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await userRef.update({
      userPassword: hashedNewPassword,
      forcePasswordChange: false
    });

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ error: 'Internal server error changing password' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ error: 'Email is required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('userEmail', '==', userEmail).get();
    
    if (snapshot.empty) {
      // Return success even if not found for security purposes
      return res.status(200).json({ message: 'If the email exists, an OTP has been sent' });
    }

    const userDoc = snapshot.docs[0];
    
    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 mins

    await usersRef.doc(userDoc.id).update({
      resetOTP: otpCode,
      resetOTPExpiry: otpExpiry
    });

    // Trigger OTP sending asynchronously to prevent blocking the client request
    emailService.sendOTP(userEmail, otpCode).catch(err => {
      console.error(`[Async OTP Error] Failed to send OTP to ${userEmail}:`, err.message);
    });

    return res.status(200).json({ message: 'If the email exists, an OTP has been sent' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userEmail, otp } = req.body;
    if (!userEmail || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('userEmail', '==', userEmail).get();
    
    if (snapshot.empty) return res.status(400).json({ error: 'Invalid OTP' });

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.resetOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > new Date(userData.resetOTPExpiry)) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    return res.status(200).json({ message: 'OTP verified successfully', userID: userDoc.id });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userID, newPassword } = req.body;
    if (!userID || !newPassword) return res.status(400).json({ error: 'UserID and new password are required' });

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters, include uppercase, lowercase, number and special character.' });
    }

    const userRef = db.collection('users').doc(userID);
    const doc = await userRef.get();

    if (!doc.exists) return res.status(404).json({ error: 'User not found' });

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await userRef.update({
      userPassword: hashedNewPassword,
      resetOTP: null,
      resetOTPExpiry: null
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ error: 'Internal server error resetting password' });
  }
};

module.exports = { registerUser, loginUser, changePassword, forgotPassword, verifyOTP, resetPassword };
