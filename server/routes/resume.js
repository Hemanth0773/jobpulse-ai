import { Router } from 'express';
import Resume from '../models/Resume.js';
import { auth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { analyzeResume } from '../services/ai.js';
import { isDbConnected } from '../config/db.js';
import store from '../config/memoryStore.js';

const router = Router();

// Upload resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileUrl = `/uploads/${req.file.filename}`;

    if (!isDbConnected()) {
      const resume = store.createResume({
        userId: req.userId,
        fileUrl,
        fileName: req.file.originalname,
      });
      return res.status(201).json({ resume, message: 'Resume uploaded successfully' });
    }

    const resume = new Resume({
      userId: req.userId,
      fileUrl,
      fileName: req.file.originalname,
    });
    await resume.save();

    res.status(201).json({ resume, message: 'Resume uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analyze resume with AI
router.post('/analyze', auth, async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!isDbConnected()) {
      let resume;
      if (resumeId) {
        resume = store.getResumeById(resumeId);
      } else {
        resume = store.getLatestResume(req.userId);
      }
      if (!resume) return res.status(404).json({ message: 'No resume found. Upload one first.' });

      const analysis = await analyzeResume(resume);
      store.updateResume(resume._id, {
        atsScore: analysis.atsScore,
        extractedSkills: analysis.extractedSkills,
        suggestions: analysis.suggestions,
        predictedSalary: analysis.predictedSalary,
        recommendedRoles: analysis.recommendedRoles,
        analyzedAt: new Date().toISOString(),
      });

      return res.json({ analysis: { ...resume, ...analysis } });
    }

    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);
    } else {
      resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    }

    if (!resume) return res.status(404).json({ message: 'No resume found. Upload one first.' });

    const analysis = await analyzeResume(resume);

    resume.atsScore = analysis.atsScore;
    resume.extractedSkills = analysis.extractedSkills;
    resume.suggestions = analysis.suggestions;
    resume.predictedSalary = analysis.predictedSalary;
    resume.recommendedRoles = analysis.recommendedRoles;
    resume.analyzedAt = new Date();
    await resume.save();

    res.json({ analysis: resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get latest resume results
router.get('/results', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const resume = store.getLatestResume(req.userId);
      if (!resume) return res.status(404).json({ message: 'No resume analysis found' });
      return res.json({ resume });
    }

    const resume = await Resume.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    if (!resume) return res.status(404).json({ message: 'No resume analysis found' });
    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
