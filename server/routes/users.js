import { Router } from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import store from '../config/memoryStore.js';

const router = Router();

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = store.findUserByIdSafe(req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      // Populate bookmarked jobs
      user.bookmarkedJobs = store.getUserBookmarks(req.userId);
      return res.json({ user });
    }

    const user = await User.findById(req.userId).populate('bookmarkedJobs');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const user = store.updateUser(req.userId, req.body);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ user });
    }

    const allowedFields = ['name', 'bio', 'location', 'skills', 'experience', 'education', 'avatar'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get bookmarked jobs
router.get('/bookmarks', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const bookmarks = store.getUserBookmarks(req.userId);
      return res.json({ bookmarks });
    }

    const user = await User.findById(req.userId).populate('bookmarkedJobs');
    res.json({ bookmarks: user.bookmarkedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const notifications = store.getUserNotifications(req.userId);
      return res.json({ notifications });
    }

    const user = await User.findById(req.userId);
    res.json({ notifications: user.notifications.sort((a, b) => b.createdAt - a.createdAt) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/notifications/:id/read', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      store.markNotificationRead(req.userId, req.params.id);
      return res.json({ message: 'Notification marked as read' });
    }

    await User.updateOne(
      { _id: req.userId, 'notifications._id': req.params.id },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
