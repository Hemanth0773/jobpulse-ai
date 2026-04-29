import { Router } from 'express';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import store from '../config/memoryStore.js';

const router = Router();

// Get all jobs (with filters)
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const result = store.getJobs(req.query);
      return res.json(result);
    }

    const { search, domain, type, minSalary, maxSalary, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (domain && domain !== 'All') {
      filter.domain = domain;
    }
    if (type && type !== 'All') {
      if (type === 'Remote') {
        filter.tags = 'Remote';
      } else {
        filter.type = type;
      }
    }
    if (minSalary) filter['salary.min'] = { $gte: Number(minSalary) };
    if (maxSalary) filter['salary.max'] = { $lte: Number(maxSalary) };

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const job = store.getJobById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      return res.json({ job });
    }

    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job
router.post('/', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const job = store.createJob(req.body, req.userId);
      return res.status(201).json({ job });
    }

    const job = new Job({ ...req.body, postedBy: req.userId });
    await job.save();
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Apply to job
router.post('/:id/apply', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const result = store.applyToJob(req.params.id, req.userId);
      if (result.error) return res.status(result.status).json({ message: result.error });
      return res.json(result);
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.applicants.includes(req.userId)) {
      return res.status(400).json({ message: 'Already applied' });
    }

    job.applicants.push(req.userId);
    await job.save();

    res.json({ message: 'Application submitted successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bookmark/unbookmark job
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const result = store.toggleBookmark(req.params.id, req.userId);
      if (!result) return res.status(404).json({ message: 'User not found' });
      return res.json(result);
    }

    const user = await User.findById(req.userId);
    const jobId = req.params.id;

    const index = user.bookmarkedJobs.indexOf(jobId);
    if (index > -1) {
      user.bookmarkedJobs.splice(index, 1);
    } else {
      user.bookmarkedJobs.push(jobId);
    }
    await user.save();

    res.json({ bookmarkedJobs: user.bookmarkedJobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update job
router.put('/:id', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const job = store.updateJob(req.params.id, req.userId, req.body);
      if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
      return res.json({ job });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, postedBy: req.userId },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!isDbConnected()) {
      const success = store.deleteJob(req.params.id, req.userId);
      if (!success) return res.status(404).json({ message: 'Job not found or unauthorized' });
      return res.json({ message: 'Job deleted' });
    }

    const job = await Job.findOneAndDelete({ _id: req.params.id, postedBy: req.userId });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
