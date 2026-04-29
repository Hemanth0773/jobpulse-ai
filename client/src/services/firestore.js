import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit as firestoreLimit, writeBatch, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

// ===== JOBS =====

export async function getJobs({ search, domain, type, limitCount = 50 } = {}) {
  const jobsRef = collection(db, 'jobs');
  const snapshot = await getDocs(jobsRef);
  let jobs = snapshot.docs.map(d => ({ _id: d.id, id: d.id, ...d.data() }));

  // Client-side filtering (Firestore doesn't support full-text search natively)
  if (search) {
    const lower = search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title?.toLowerCase().includes(lower) ||
      j.company?.toLowerCase().includes(lower) ||
      (j.tags || []).some(t => t.toLowerCase().includes(lower))
    );
  }
  if (domain && domain !== 'All') {
    jobs = jobs.filter(j => j.domain === domain);
  }
  if (type && type !== 'All') {
    if (type === 'Remote') {
      jobs = jobs.filter(j => (j.tags || []).includes('Remote'));
    } else {
      jobs = jobs.filter(j => j.type === type);
    }
  }

  return { jobs: jobs.slice(0, limitCount), total: jobs.length };
}

export async function getJobById(id) {
  const docRef = doc(db, 'jobs', id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { _id: snap.id, id: snap.id, ...snap.data() };
}

export async function createJob(data) {
  const docRef = await addDoc(collection(db, 'jobs'), {
    ...data,
    applicants: [],
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { _id: docRef.id, id: docRef.id, ...data };
}

// ===== USERS =====

export async function getUserProfile(uid) {
  const docRef = doc(db, 'users', uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
}

export async function createUserProfile(uid, data) {
  await setDoc(doc(db, 'users', uid), {
    uid,
    name: data.name || '',
    email: data.email || '',
    role: data.role || 'jobseeker',
    skills: data.skills || [],
    location: data.location || '',
    bio: data.bio || '',
    bookmarkedJobs: [],
    resumeUrl: '',
    avatar: data.avatar || '',
    experience: '',
    education: '',
    notifications: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserProfile(uid, updates) {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getUserBookmarks(uid) {
  const user = await getUserProfile(uid);
  if (!user || !user.bookmarkedJobs?.length) return [];
  // Fetch each bookmarked job
  const jobs = [];
  for (const jobId of user.bookmarkedJobs) {
    const job = await getJobById(jobId);
    if (job) jobs.push(job);
  }
  return jobs;
}

export async function toggleBookmark(uid, jobId) {
  const user = await getUserProfile(uid);
  if (!user) return [];
  const bookmarks = user.bookmarkedJobs || [];
  const index = bookmarks.indexOf(jobId);
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(jobId);
  }
  await updateUserProfile(uid, { bookmarkedJobs: bookmarks });
  return bookmarks;
}

// ===== APPLICATIONS =====

export async function applyToJob(userId, jobId) {
  // Check if already applied
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    where('jobId', '==', jobId)
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error('Already applied to this job');
  }

  const docRef = await addDoc(collection(db, 'applications'), {
    userId,
    jobId,
    status: 'pending',
    appliedAt: serverTimestamp(),
  });
  return { id: docRef.id, userId, jobId, status: 'pending' };
}

export async function getUserApplications(userId) {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    orderBy('appliedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function hasApplied(userId, jobId) {
  const q = query(
    collection(db, 'applications'),
    where('userId', '==', userId),
    where('jobId', '==', jobId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

// ===== SEED DATA =====

export async function seedJobs() {
  const snapshot = await getDocs(collection(db, 'jobs'));
  if (!snapshot.empty) {
    console.log('✅ Jobs already exist in Firestore, skipping seed');
    return;
  }

  console.log('🌱 Seeding Firestore with jobs...');
  const batch = writeBatch(db);

  const jobs = [
    { title: 'Senior React Developer', company: 'Google', description: 'We are looking for an experienced React developer to join our core team building next-generation web applications used by billions of people worldwide.', requirements: ['5+ years React experience', 'TypeScript proficiency', 'Performance optimization', 'Testing (Jest, RTL)', 'CI/CD familiarity'], responsibilities: ['Design and implement complex UI features', 'Optimize application performance', 'Write clean, maintainable code', 'Participate in code reviews', 'Mentor junior engineers'], salary: { min: 18, max: 32 }, location: 'Remote', type: 'Full-time', domain: 'Frontend Dev', tags: ['React', 'TypeScript', 'Remote', 'Senior'], skillsRequired: ['React.js', 'TypeScript', 'JavaScript', 'CSS'], applicants: [], isActive: true },
    { title: 'AI/ML Engineer', company: 'OpenAI', description: 'Join the team building the future of artificial intelligence. Work on large language models, reinforcement learning, and cutting-edge research.', requirements: ['MS/PhD in CS or related', 'PyTorch/TensorFlow', 'NLP experience', 'Strong math background', 'Publications preferred'], responsibilities: ['Research novel ML architectures', 'Train and optimize large-scale models', 'Collaborate with safety team', 'Write research papers'], salary: { min: 25, max: 45 }, location: 'San Francisco', type: 'Full-time', domain: 'AI / ML', tags: ['Python', 'ML', 'On-site', 'Senior'], skillsRequired: ['Python', 'PyTorch', 'NLP', 'Mathematics'], applicants: [], isActive: true },
    { title: 'Full Stack Developer', company: 'Netflix', description: 'Build and maintain the platforms that deliver entertainment to 200M+ subscribers worldwide.', requirements: ['React + Node.js', '3+ years experience', 'Microservices architecture', 'AWS/GCP', 'Strong problem solving'], responsibilities: ['Build streaming platform services', 'Design RESTful and GraphQL APIs', 'Ensure high availability', 'Optimize performance'], salary: { min: 20, max: 35 }, location: 'Remote', type: 'Full-time', domain: 'Backend Dev', tags: ['Node.js', 'React', 'Remote', 'Mid-Senior'], skillsRequired: ['React', 'Node.js', 'MongoDB', 'AWS'], applicants: [], isActive: true },
    { title: 'UI/UX Designer', company: 'Figma', description: 'Design the tools that designers use. Create intuitive interfaces for millions of creative professionals.', requirements: ['Figma expertise', 'User research skills', '3+ years UX experience', 'Design systems', 'Prototyping'], responsibilities: ['Design new features', 'Conduct user research', 'Create design system components', 'Collaborate with engineers'], salary: { min: 15, max: 28 }, location: 'New York', type: 'Hybrid', domain: 'UI/UX Design', tags: ['Figma', 'Design', 'Hybrid', 'Mid-level'], skillsRequired: ['Figma', 'Sketch', 'UX Research', 'Prototyping'], applicants: [], isActive: true },
    { title: 'DevOps Engineer', company: 'AWS', description: 'Help customers architect and deploy cloud solutions. Build internal tools and automation.', requirements: ['AWS certified', 'Docker/Kubernetes', 'Terraform', 'CI/CD pipelines', 'Linux administration'], responsibilities: ['Design cloud architectures', 'Automate infrastructure', 'Monitor and optimize costs', 'Implement security best practices'], salary: { min: 22, max: 38 }, location: 'Seattle', type: 'On-site', domain: 'DevOps', tags: ['AWS', 'Docker', 'K8s', 'Senior'], skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'Terraform'], applicants: [], isActive: true },
    { title: 'Data Scientist', company: 'Meta', description: 'Drive product decisions through data analysis. Build ML models to improve user experience.', requirements: ['Python/R', 'SQL mastery', 'Statistical modeling', 'A/B testing', 'Communication skills'], responsibilities: ['Analyze large-scale datasets', 'Design A/B experiments', 'Build predictive models', 'Present findings to leadership'], salary: { min: 20, max: 40 }, location: 'Remote', type: 'Full-time', domain: 'Data Science', tags: ['Python', 'SQL', 'Remote', 'Mid-Senior'], skillsRequired: ['Python', 'SQL', 'Statistics', 'Machine Learning'], applicants: [], isActive: true },
    { title: 'Backend Engineer', company: 'Spotify', description: 'Build the backend systems that power music streaming for 500M+ users.', requirements: ['Java/Go', 'Distributed systems', 'Event-driven architecture', 'PostgreSQL', 'gRPC'], responsibilities: ['Build streaming backend services', 'Design event-driven architectures', 'Optimize database performance', 'Build recommendation pipelines'], salary: { min: 16, max: 30 }, location: 'London', type: 'Hybrid', domain: 'Backend Dev', tags: ['Java', 'Microservices', 'Hybrid', 'Mid-level'], skillsRequired: ['Java', 'Go', 'PostgreSQL', 'gRPC'], applicants: [], isActive: true },
    { title: 'iOS Developer', company: 'Apple', description: 'Build the world\'s most popular mobile platform. Work on iOS system apps.', requirements: ['Swift mastery', 'UIKit + SwiftUI', '4+ years iOS', 'Performance optimization', 'Accessibility'], responsibilities: ['Build iOS system apps', 'Optimize performance', 'Implement accessibility features', 'Contribute to frameworks'], salary: { min: 22, max: 40 }, location: 'Cupertino', type: 'On-site', domain: 'Mobile Dev', tags: ['Swift', 'iOS', 'On-site', 'Senior'], skillsRequired: ['Swift', 'UIKit', 'SwiftUI', 'Xcode'], applicants: [], isActive: true },
    { title: 'Cloud Architect', company: 'Microsoft', description: 'Design and implement cloud architecture solutions for enterprise clients.', requirements: ['Azure expertise', 'Architecture patterns', 'Enterprise experience', 'Security best practices', 'Multi-cloud'], responsibilities: ['Design cloud architectures', 'Lead enterprise migrations', 'Implement security standards', 'Technical mentoring'], salary: { min: 28, max: 50 }, location: 'Remote', type: 'Full-time', domain: 'DevOps', tags: ['Azure', 'Cloud', 'Remote', 'Lead'], skillsRequired: ['Azure', 'Cloud Architecture', 'Security', 'Networking'], applicants: [], isActive: true },
    { title: 'ML Research Scientist', company: 'DeepMind', description: 'Push the boundaries of AI through fundamental research.', requirements: ['PhD in ML/AI', 'Published research', 'PyTorch', 'Strong theoretical foundations', 'Collaborative mindset'], responsibilities: ['Conduct fundamental AI research', 'Publish papers', 'Build research prototypes', 'Collaborate with teams globally'], salary: { min: 30, max: 55 }, location: 'London', type: 'Full-time', domain: 'AI / ML', tags: ['PyTorch', 'Research', 'On-site', 'Principal'], skillsRequired: ['PyTorch', 'Mathematics', 'Research', 'Python'], applicants: [], isActive: true },
    { title: 'Frontend Engineer', company: 'Vercel', description: 'Build the platform that powers the modern web. Work on Next.js and developer experience.', requirements: ['Next.js expert', 'React mastery', 'Performance optimization', 'Edge computing', 'TypeScript'], responsibilities: ['Build Next.js platform features', 'Optimize developer experience', 'Contribute to open source', 'Build edge computing tools'], salary: { min: 15, max: 28 }, location: 'Remote', type: 'Full-time', domain: 'Frontend Dev', tags: ['Next.js', 'React', 'Remote', 'Mid-level'], skillsRequired: ['Next.js', 'React', 'TypeScript', 'Edge Computing'], applicants: [], isActive: true },
    { title: 'Security Engineer', company: 'CrowdStrike', description: 'Protect organizations from cyber threats. Build and maintain security tools.', requirements: ['Security certifications', 'Python/Go', 'Threat modeling', 'Incident response', 'Cloud security'], responsibilities: ['Build security tools', 'Conduct threat analysis', 'Develop incident response procedures', 'Audit cloud infrastructure'], salary: { min: 20, max: 38 }, location: 'Austin', type: 'Hybrid', domain: 'Cybersecurity', tags: ['Security', 'Python', 'Hybrid', 'Mid-Senior'], skillsRequired: ['Python', 'Go', 'Threat Modeling', 'Cloud Security'], applicants: [], isActive: true },
    { title: 'Product Manager', company: 'Stripe', description: 'Define and drive the product vision for payment infrastructure.', requirements: ['3+ years PM experience', 'Technical background', 'Data-driven', 'Fintech knowledge', 'Strong communication'], responsibilities: ['Define product roadmap', 'Collaborate with engineering', 'Analyze market data', 'Ship product features'], salary: { min: 22, max: 42 }, location: 'San Francisco', type: 'Hybrid', domain: 'General', tags: ['Product', 'Fintech', 'Hybrid', 'Senior'], skillsRequired: ['Product Management', 'Data Analysis', 'Fintech', 'Strategy'], applicants: [], isActive: true },
    { title: 'Android Developer', company: 'Samsung', description: 'Build next-generation mobile experiences for Samsung Galaxy devices.', requirements: ['Kotlin/Java', 'Android SDK', 'Jetpack Compose', 'Performance profiling', 'Multi-device'], responsibilities: ['Build system apps', 'Develop One UI features', 'Optimize for foldable devices', 'Profile performance'], salary: { min: 14, max: 26 }, location: 'Bangalore', type: 'On-site', domain: 'Mobile Dev', tags: ['Kotlin', 'Android', 'On-site', 'Mid-level'], skillsRequired: ['Kotlin', 'Java', 'Jetpack Compose', 'Android SDK'], applicants: [], isActive: true },
    { title: 'Blockchain Developer', company: 'Coinbase', description: 'Build the crypto economy. Develop smart contracts and DeFi protocols.', requirements: ['Solidity', 'Ethereum/EVM', 'Web3.js', 'DeFi protocols', 'Security auditing'], responsibilities: ['Develop smart contracts', 'Build DeFi protocols', 'Audit security', 'Build trading infrastructure'], salary: { min: 24, max: 45 }, location: 'Remote', type: 'Full-time', domain: 'Backend Dev', tags: ['Blockchain', 'Solidity', 'Remote', 'Senior'], skillsRequired: ['Solidity', 'Ethereum', 'Web3.js', 'Security'], applicants: [], isActive: true },
  ];

  jobs.forEach((job, i) => {
    const docRef = doc(db, 'jobs', `job_${i + 1}`);
    batch.set(docRef, { ...job, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  });

  await batch.commit();
  console.log(`✅ Seeded ${jobs.length} jobs to Firestore`);
}
