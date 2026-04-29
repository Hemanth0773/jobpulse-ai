import { Router } from 'express';
import User from '../models/User.js';
import { auth, generateToken } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import store from '../config/memoryStore.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!isDbConnected()) {
      // In-memory mode
      const existing = store.findUserByEmail(email);
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const hashed = await store.hashPassword(password);
      const user = store.createUser({ name, email, password: hashed, role: role || 'jobseeker' });
      const token = generateToken(user._id);
      const { password: _, ...safeUser } = user;
      return res.status(201).json({ token, user: safeUser });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({ name, email, password, role: role || 'jobseeker' });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isDbConnected()) {
      // In-memory mode
      const user = store.findUserByEmail(email);
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await store.comparePassword(email, password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      const token = generateToken(user._id);
      const { password: _, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google OAuth (placeholder)
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    if (!isDbConnected()) {
      let user = store.findUserByEmail(email);
      if (!user) {
        const hashed = await store.hashPassword(`google-${Date.now()}`);
        user = store.createUser({ name, email, password: hashed, googleId, avatar });
      }
      const token = generateToken(user._id);
      const { password: _, ...safeUser } = user;
      return res.json({ token, user: safeUser });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = new User({ name, email, googleId, avatar, password: `google-${Date.now()}` });
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = store.findUserByIdSafe(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ user });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
