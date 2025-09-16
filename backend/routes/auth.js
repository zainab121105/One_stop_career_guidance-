
import express from 'express';
import { verifyFirebaseToken } from '../config/firebase.js';
import User from '../models/User.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

// Login user with email and password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    // Optionally, generate JWT here and return it
    res.json({ success: true, message: 'Login successful.' });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

// Register new user with email and password
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      name: email.split('@')[0], // Default name from email
      onboardingCompleted: false,
    });
    await user.save();
    logger.info(`New local user registered: ${user.email}`);
    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});



// Verify token and get or create user
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);
    
    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || '',
        photoURL: decodedToken.picture,
        onboardingCompleted: false,
      });

      await user.save();
      logger.info(`New user created: ${user.email}`);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        photoURL: user.photoURL,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
});

export default router;