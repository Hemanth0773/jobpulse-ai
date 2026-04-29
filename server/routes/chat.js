import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { getChatResponse } from '../services/ai.js';

const router = Router();

// Send message to AI chatbot
router.post('/message', auth, async (req, res) => {
  try {
    const { message, mode } = req.body;
    const response = await getChatResponse(message, mode);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat history (placeholder — store in-memory or DB as needed)
router.get('/history', auth, async (req, res) => {
  res.json({ history: [] });
});

export default router;
