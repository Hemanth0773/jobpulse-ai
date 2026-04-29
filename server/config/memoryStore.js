// In-memory data store — used when MongoDB is not available
// All data resets on server restart

import bcrypt from 'bcryptjs';

let idCounter = 100;
const nextId = () => String(++idCounter);

// ===== Pre-seeded Users =====
const hashedPassword = bcrypt.hashSync('password123', 12);
const adminPassword = bcrypt.hashSync('admin123', 12);

const users = [
  {
    _id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: hashedPassword,
    role: 'jobseeker',
    skills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS'],
    location: 'San Francisco, CA',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
    bookmarkedJobs: ['1', '3', '11'],
    resume: '',
    avatar: '',
    experience: '5 years',
    education: 'B.Tech Computer Science',
    notifications: [
      { _id: 'n1', text: 'New job match found!', read: false, createdAt: new Date().toISOString() },
      { _id: 'n2', text: 'Your resume score improved to 87', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { _id: 'n3', text: 'Application viewed by Google', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Sarah Tech',
    email: 'sarah@techcorp.com',
    password: hashedPassword,
    role: 'employer',
    skills: [],
    location: 'New York, NY',
    bio: 'HR Lead at TechCorp. Hiring top talent in AI and full-stack development.',
    bookmarkedJobs: [],
    resume: '',
    avatar: '',
    experience: '',
    education: '',
    notifications: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Admin User',
    email: 'admin@jobpulse.ai',
    password: adminPassword,
    role: 'admin',
    skills: [],
    location: 'Remote',
    bio: 'Platform administrator.',
    bookmarkedJobs: [],
    resume: '',
    avatar: '',
    experience: '',
    education: '',
    notifications: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ===== Pre-seeded Jobs =====
const jobs = [
  {
    _id: '1', title: 'Senior React Developer', company: 'Google',
    description: 'We are looking for an experienced React developer to join our core team building next-generation web applications.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Performance optimization', 'Testing (Jest, RTL)', 'CI/CD familiarity'],
    salary: { min: 18, max: 32 }, location: 'Remote', type: 'Full-time', domain: 'Frontend Dev',
    tags: ['React', 'TypeScript', 'Remote', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '2', title: 'AI/ML Engineer', company: 'OpenAI',
    description: 'Join the team building the future of artificial intelligence. Work on large language models and cutting-edge research.',
    requirements: ['MS/PhD in CS or related', 'PyTorch/TensorFlow', 'NLP experience', 'Strong math background', 'Publications preferred'],
    salary: { min: 25, max: 45 }, location: 'San Francisco', type: 'Full-time', domain: 'AI / ML',
    tags: ['Python', 'ML', 'On-site', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '3', title: 'Full Stack Developer', company: 'Netflix',
    description: 'Build and maintain the platforms that deliver entertainment to 200M+ subscribers.',
    requirements: ['React + Node.js', '3+ years experience', 'Microservices architecture', 'AWS/GCP', 'Strong problem solving'],
    salary: { min: 20, max: 35 }, location: 'Remote', type: 'Full-time', domain: 'Backend Dev',
    tags: ['Node.js', 'React', 'Remote', 'Mid-Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '4', title: 'UI/UX Designer', company: 'Figma',
    description: 'Design the tools that designers use. Create intuitive interfaces for millions of creative professionals.',
    requirements: ['Figma expertise', 'User research skills', '3+ years UX experience', 'Design systems', 'Prototyping'],
    salary: { min: 15, max: 28 }, location: 'New York', type: 'Hybrid', domain: 'UI/UX Design',
    tags: ['Figma', 'Design', 'Hybrid', 'Mid-level'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '5', title: 'DevOps Engineer', company: 'AWS',
    description: 'Help customers architect and deploy cloud solutions. Build internal tools and automation.',
    requirements: ['AWS certified', 'Docker/Kubernetes', 'Terraform', 'CI/CD pipelines', 'Linux administration'],
    salary: { min: 22, max: 38 }, location: 'Seattle', type: 'On-site', domain: 'DevOps',
    tags: ['AWS', 'Docker', 'K8s', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '6', title: 'Data Scientist', company: 'Meta',
    description: 'Drive product decisions through data analysis. Build ML models to improve user experience.',
    requirements: ['Python/R', 'SQL mastery', 'Statistical modeling', 'A/B testing', 'Communication skills'],
    salary: { min: 20, max: 40 }, location: 'Remote', type: 'Full-time', domain: 'Data Science',
    tags: ['Python', 'SQL', 'Remote', 'Mid-Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '7', title: 'Backend Engineer', company: 'Spotify',
    description: 'Build the backend systems that power music streaming for 500M+ users.',
    requirements: ['Java/Go', 'Distributed systems', 'Event-driven architecture', 'PostgreSQL', 'gRPC'],
    salary: { min: 16, max: 30 }, location: 'London', type: 'Hybrid', domain: 'Backend Dev',
    tags: ['Java', 'Microservices', 'Hybrid', 'Mid-level'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '8', title: 'iOS Developer', company: 'Apple',
    description: 'Build the world\'s most popular mobile platform. Work on iOS system apps, frameworks, and developer tools.',
    requirements: ['Swift mastery', 'UIKit + SwiftUI', '4+ years iOS', 'Performance optimization', 'Accessibility'],
    salary: { min: 22, max: 40 }, location: 'Cupertino', type: 'On-site', domain: 'Mobile Dev',
    tags: ['Swift', 'iOS', 'On-site', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '9', title: 'Cloud Architect', company: 'Microsoft',
    description: 'Design and implement cloud architecture solutions for enterprise clients.',
    requirements: ['Azure expertise', 'Architecture patterns', 'Enterprise experience', 'Security best practices', 'Multi-cloud'],
    salary: { min: 28, max: 50 }, location: 'Remote', type: 'Full-time', domain: 'DevOps',
    tags: ['Azure', 'Cloud', 'Remote', 'Lead'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '10', title: 'ML Research Scientist', company: 'DeepMind',
    description: 'Push the boundaries of AI through fundamental research.',
    requirements: ['PhD in ML/AI', 'Published research', 'PyTorch', 'Strong theoretical foundations', 'Collaborative mindset'],
    salary: { min: 30, max: 55 }, location: 'London', type: 'Full-time', domain: 'AI / ML',
    tags: ['PyTorch', 'Research', 'On-site', 'Principal'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '11', title: 'Frontend Engineer', company: 'Vercel',
    description: 'Build the platform that powers the modern web. Work on Next.js, edge computing, and developer experience.',
    requirements: ['Next.js expert', 'React mastery', 'Performance optimization', 'Edge computing', 'TypeScript'],
    salary: { min: 15, max: 28 }, location: 'Remote', type: 'Full-time', domain: 'Frontend Dev',
    tags: ['Next.js', 'React', 'Remote', 'Mid-level'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '12', title: 'Security Engineer', company: 'CrowdStrike',
    description: 'Protect organizations from cyber threats. Build and maintain security tools.',
    requirements: ['Security certifications', 'Python/Go', 'Threat modeling', 'Incident response', 'Cloud security'],
    salary: { min: 20, max: 38 }, location: 'Austin', type: 'Hybrid', domain: 'Cybersecurity',
    tags: ['Security', 'Python', 'Hybrid', 'Mid-Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '13', title: 'Product Manager', company: 'Stripe',
    description: 'Define and drive the product vision for Stripe\'s payment infrastructure.',
    requirements: ['3+ years PM experience', 'Technical background', 'Data-driven', 'Fintech knowledge', 'Strong communication'],
    salary: { min: 22, max: 42 }, location: 'San Francisco', type: 'Hybrid', domain: 'General',
    tags: ['Product', 'Fintech', 'Hybrid', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '14', title: 'Android Developer', company: 'Samsung',
    description: 'Build next-generation mobile experiences for Samsung Galaxy devices.',
    requirements: ['Kotlin/Java', 'Android SDK', 'Jetpack Compose', 'Performance profiling', 'Multi-device'],
    salary: { min: 14, max: 26 }, location: 'Bangalore', type: 'On-site', domain: 'Mobile Dev',
    tags: ['Kotlin', 'Android', 'On-site', 'Mid-level'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    _id: '15', title: 'Blockchain Developer', company: 'Coinbase',
    description: 'Build the crypto economy. Develop smart contracts and DeFi protocols.',
    requirements: ['Solidity', 'Ethereum/EVM', 'Web3.js', 'DeFi protocols', 'Security auditing'],
    salary: { min: 24, max: 45 }, location: 'Remote', type: 'Full-time', domain: 'Backend Dev',
    tags: ['Blockchain', 'Solidity', 'Remote', 'Senior'], applicants: [], postedBy: '2', isActive: true,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const resumes = [];

// ===== Helper to strip password from user objects =====
function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

// ===== Memory Store API =====
const store = {
  // ----- Users -----
  findUserByEmail(email) {
    return users.find(u => u.email === email.toLowerCase()) || null;
  },

  findUserById(id) {
    return users.find(u => u._id === id) || null;
  },

  findUserByIdSafe(id) {
    return sanitizeUser(this.findUserById(id));
  },

  createUser({ name, email, password, role = 'jobseeker', googleId, avatar }) {
    const user = {
      _id: nextId(),
      name,
      email: email.toLowerCase(),
      password,
      role,
      skills: [],
      location: '',
      bio: '',
      bookmarkedJobs: [],
      resume: '',
      avatar: avatar || '',
      experience: '',
      education: '',
      googleId: googleId || undefined,
      notifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },

  updateUser(id, updates) {
    const user = this.findUserById(id);
    if (!user) return null;
    const allowedFields = ['name', 'bio', 'location', 'skills', 'experience', 'education', 'avatar'];
    for (const field of allowedFields) {
      if (updates[field] !== undefined) user[field] = updates[field];
    }
    user.updatedAt = new Date().toISOString();
    return sanitizeUser(user);
  },

  getUserBookmarks(id) {
    const user = this.findUserById(id);
    if (!user) return [];
    return user.bookmarkedJobs.map(jid => jobs.find(j => j._id === jid)).filter(Boolean);
  },

  getUserNotifications(id) {
    const user = this.findUserById(id);
    if (!user) return [];
    return [...user.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  markNotificationRead(userId, notifId) {
    const user = this.findUserById(userId);
    if (!user) return false;
    const notif = user.notifications.find(n => n._id === notifId);
    if (notif) notif.read = true;
    return true;
  },

  async comparePassword(email, candidatePassword) {
    const user = this.findUserByEmail(email);
    if (!user) return false;
    return bcrypt.compare(candidatePassword, user.password);
  },

  async hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  // ----- Jobs -----
  getJobs({ search, domain, type, minSalary, maxSalary, page = 1, limit = 20 } = {}) {
    let filtered = jobs.filter(j => j.isActive);

    if (search) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(lower) ||
        j.company.toLowerCase().includes(lower) ||
        j.domain.toLowerCase().includes(lower) ||
        j.tags.some(t => t.toLowerCase().includes(lower))
      );
    }
    if (domain && domain !== 'All') {
      filtered = filtered.filter(j => j.domain === domain);
    }
    if (type && type !== 'All') {
      if (type === 'Remote') {
        filtered = filtered.filter(j => j.tags.includes('Remote'));
      } else {
        filtered = filtered.filter(j => j.type === type);
      }
    }
    if (minSalary) filtered = filtered.filter(j => j.salary.min >= Number(minSalary));
    if (maxSalary) filtered = filtered.filter(j => j.salary.max <= Number(maxSalary));

    const total = filtered.length;
    const p = Number(page);
    const l = Number(limit);
    const paged = filtered.slice((p - 1) * l, p * l);

    return { jobs: paged, total, page: p, pages: Math.ceil(total / l) };
  },

  getJobById(id) {
    const job = jobs.find(j => j._id === id);
    if (!job) return null;
    // Populate postedBy
    const poster = this.findUserByIdSafe(job.postedBy);
    return { ...job, postedBy: poster ? { _id: poster._id, name: poster.name, email: poster.email } : null };
  },

  createJob(data, userId) {
    const job = {
      _id: nextId(),
      ...data,
      applicants: [],
      postedBy: userId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jobs.push(job);
    return job;
  },

  applyToJob(jobId, userId) {
    const job = jobs.find(j => j._id === jobId);
    if (!job) return { error: 'Job not found', status: 404 };
    if (job.applicants.includes(userId)) return { error: 'Already applied', status: 400 };
    job.applicants.push(userId);
    return { job, message: 'Application submitted successfully' };
  },

  toggleBookmark(jobId, userId) {
    const user = this.findUserById(userId);
    if (!user) return null;
    const index = user.bookmarkedJobs.indexOf(jobId);
    if (index > -1) {
      user.bookmarkedJobs.splice(index, 1);
    } else {
      user.bookmarkedJobs.push(jobId);
    }
    return { bookmarkedJobs: user.bookmarkedJobs };
  },

  updateJob(jobId, userId, data) {
    const job = jobs.find(j => j._id === jobId && j.postedBy === userId);
    if (!job) return null;
    Object.assign(job, data, { updatedAt: new Date().toISOString() });
    return job;
  },

  deleteJob(jobId, userId) {
    const index = jobs.findIndex(j => j._id === jobId && j.postedBy === userId);
    if (index === -1) return false;
    jobs.splice(index, 1);
    return true;
  },

  // ----- Resumes -----
  createResume(data) {
    const resume = {
      _id: nextId(),
      ...data,
      atsScore: 0,
      extractedSkills: [],
      suggestions: [],
      predictedSalary: { min: 0, max: 0 },
      recommendedRoles: [],
      analyzedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    resumes.push(resume);
    return resume;
  },

  getLatestResume(userId) {
    const userResumes = resumes.filter(r => r.userId === userId);
    return userResumes.length > 0 ? userResumes[userResumes.length - 1] : null;
  },

  getResumeById(id) {
    return resumes.find(r => r._id === id) || null;
  },

  updateResume(id, data) {
    const resume = resumes.find(r => r._id === id);
    if (!resume) return null;
    Object.assign(resume, data, { updatedAt: new Date().toISOString() });
    return resume;
  },
};

export default store;
