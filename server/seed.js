// Database Seed Script — Run with: node seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';

// ===== Schemas (inline to avoid import issues) =====
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: 'jobseeker' },
  skills: [String],
  location: String,
  bio: String,
  bookmarkedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resume: String,
  notifications: [{ text: String, read: Boolean, createdAt: Date }],
}, { timestamps: true });

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  companyLogo: String,
  description: String,
  requirements: [String],
  salary: { min: Number, max: Number },
  location: String,
  type: String,
  domain: String,
  tags: [String],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

jobSchema.index({ title: 'text', company: 'text', domain: 'text' });

const User = mongoose.model('User', userSchema);
const Job = mongoose.model('Job', jobSchema);

// ===== Seed Data =====
const users = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: await bcrypt.hash('password123', 12),
    role: 'jobseeker',
    skills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'AWS'],
    location: 'San Francisco, CA',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
    notifications: [
      { text: 'New job match found!', read: false, createdAt: new Date() },
      { text: 'Your resume score improved to 87', read: false, createdAt: new Date(Date.now() - 3600000) },
      { text: 'Application viewed by Google', read: true, createdAt: new Date(Date.now() - 86400000) },
    ],
  },
  {
    name: 'Sarah Tech',
    email: 'sarah@techcorp.com',
    password: await bcrypt.hash('password123', 12),
    role: 'employer',
    skills: [],
    location: 'New York, NY',
    bio: 'HR Lead at TechCorp. Hiring top talent in AI and full-stack development.',
  },
  {
    name: 'Admin User',
    email: 'admin@jobpulse.ai',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    skills: [],
    location: 'Remote',
    bio: 'Platform administrator.',
  },
];

const jobs = [
  {
    title: 'Senior React Developer',
    company: 'Google',
    description: 'We are looking for an experienced React developer to join our core team building next-generation web applications. You will work on Google Workspace products used by billions of people.',
    requirements: ['5+ years React experience', 'TypeScript proficiency', 'Performance optimization', 'Testing (Jest, RTL)', 'CI/CD familiarity'],
    salary: { min: 18, max: 32 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'Frontend Dev',
    tags: ['React', 'TypeScript', 'Remote', 'Senior'],
  },
  {
    title: 'AI/ML Engineer',
    company: 'OpenAI',
    description: 'Join the team building the future of artificial intelligence. Work on large language models, reinforcement learning, and cutting-edge research.',
    requirements: ['MS/PhD in CS or related', 'PyTorch/TensorFlow', 'NLP experience', 'Strong math background', 'Publications preferred'],
    salary: { min: 25, max: 45 },
    location: 'San Francisco',
    type: 'Full-time',
    domain: 'AI / ML',
    tags: ['Python', 'ML', 'On-site', 'Senior'],
  },
  {
    title: 'Full Stack Developer',
    company: 'Netflix',
    description: 'Build and maintain the platforms that deliver entertainment to 200M+ subscribers. Work with microservices, React, and Node.js at massive scale.',
    requirements: ['React + Node.js', '3+ years experience', 'Microservices architecture', 'AWS/GCP', 'Strong problem solving'],
    salary: { min: 20, max: 35 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'Backend Dev',
    tags: ['Node.js', 'React', 'Remote', 'Mid-Senior'],
  },
  {
    title: 'UI/UX Designer',
    company: 'Figma',
    description: 'Design the tools that designers use. Work on Figma\'s core product experience, creating intuitive interfaces for millions of creative professionals.',
    requirements: ['Figma expertise', 'User research skills', '3+ years UX experience', 'Design systems', 'Prototyping'],
    salary: { min: 15, max: 28 },
    location: 'New York',
    type: 'Hybrid',
    domain: 'UI/UX Design',
    tags: ['Figma', 'Design', 'Hybrid', 'Mid-level'],
  },
  {
    title: 'DevOps Engineer',
    company: 'AWS',
    description: 'Help customers architect and deploy cloud solutions. Build internal tools and automation for AWS infrastructure services.',
    requirements: ['AWS certified', 'Docker/Kubernetes', 'Terraform', 'CI/CD pipelines', 'Linux administration'],
    salary: { min: 22, max: 38 },
    location: 'Seattle',
    type: 'On-site',
    domain: 'DevOps',
    tags: ['AWS', 'Docker', 'K8s', 'Senior'],
  },
  {
    title: 'Data Scientist',
    company: 'Meta',
    description: 'Drive product decisions through data analysis. Build ML models to improve user experience across Facebook, Instagram, and WhatsApp.',
    requirements: ['Python/R', 'SQL mastery', 'Statistical modeling', 'A/B testing', 'Communication skills'],
    salary: { min: 20, max: 40 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'Data Science',
    tags: ['Python', 'SQL', 'Remote', 'Mid-Senior'],
  },
  {
    title: 'Backend Engineer',
    company: 'Spotify',
    description: 'Build the backend systems that power music streaming for 500M+ users. Work on recommendation engines, payment systems, and content delivery.',
    requirements: ['Java/Go', 'Distributed systems', 'Event-driven architecture', 'PostgreSQL', 'gRPC'],
    salary: { min: 16, max: 30 },
    location: 'London',
    type: 'Hybrid',
    domain: 'Backend Dev',
    tags: ['Java', 'Microservices', 'Hybrid', 'Mid-level'],
  },
  {
    title: 'iOS Developer',
    company: 'Apple',
    description: 'Join the team that builds the world\'s most popular mobile platform. Work on iOS system apps, frameworks, and developer tools.',
    requirements: ['Swift mastery', 'UIKit + SwiftUI', '4+ years iOS', 'Performance optimization', 'Accessibility'],
    salary: { min: 22, max: 40 },
    location: 'Cupertino',
    type: 'On-site',
    domain: 'Mobile Dev',
    tags: ['Swift', 'iOS', 'On-site', 'Senior'],
  },
  {
    title: 'Cloud Architect',
    company: 'Microsoft',
    description: 'Design and implement cloud architecture solutions for enterprise clients. Lead migrations from on-premise to Azure cloud infrastructure.',
    requirements: ['Azure expertise', 'Architecture patterns', 'Enterprise experience', 'Security best practices', 'Multi-cloud'],
    salary: { min: 28, max: 50 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'DevOps',
    tags: ['Azure', 'Cloud', 'Remote', 'Lead'],
  },
  {
    title: 'ML Research Scientist',
    company: 'DeepMind',
    description: 'Push the boundaries of artificial intelligence through fundamental research. Work on projects spanning from protein folding to game-playing AI.',
    requirements: ['PhD in ML/AI', 'Published research', 'PyTorch', 'Strong theoretical foundations', 'Collaborative mindset'],
    salary: { min: 30, max: 55 },
    location: 'London',
    type: 'Full-time',
    domain: 'AI / ML',
    tags: ['PyTorch', 'Research', 'On-site', 'Principal'],
  },
  {
    title: 'Frontend Engineer',
    company: 'Vercel',
    description: 'Build the platform that powers the modern web. Work on Next.js, edge computing, and developer experience tools used by millions.',
    requirements: ['Next.js expert', 'React mastery', 'Performance optimization', 'Edge computing', 'TypeScript'],
    salary: { min: 15, max: 28 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'Frontend Dev',
    tags: ['Next.js', 'React', 'Remote', 'Mid-level'],
  },
  {
    title: 'Security Engineer',
    company: 'CrowdStrike',
    description: 'Protect organizations from cyber threats. Build and maintain security tools, conduct threat analysis, and develop incident response procedures.',
    requirements: ['Security certifications', 'Python/Go', 'Threat modeling', 'Incident response', 'Cloud security'],
    salary: { min: 20, max: 38 },
    location: 'Austin',
    type: 'Hybrid',
    domain: 'Cybersecurity',
    tags: ['Security', 'Python', 'Hybrid', 'Mid-Senior'],
  },
  {
    title: 'Product Manager',
    company: 'Stripe',
    description: 'Define and drive the product vision for Stripe\'s payment infrastructure. Work with engineering, design, and business teams to ship features.',
    requirements: ['3+ years PM experience', 'Technical background', 'Data-driven', 'Fintech knowledge', 'Strong communication'],
    salary: { min: 22, max: 42 },
    location: 'San Francisco',
    type: 'Hybrid',
    domain: 'General',
    tags: ['Product', 'Fintech', 'Hybrid', 'Senior'],
  },
  {
    title: 'Android Developer',
    company: 'Samsung',
    description: 'Build next-generation mobile experiences for Samsung Galaxy devices. Work on system apps, One UI customizations, and foldable device features.',
    requirements: ['Kotlin/Java', 'Android SDK', 'Jetpack Compose', 'Performance profiling', 'Multi-device'],
    salary: { min: 14, max: 26 },
    location: 'Bangalore',
    type: 'On-site',
    domain: 'Mobile Dev',
    tags: ['Kotlin', 'Android', 'On-site', 'Mid-level'],
  },
  {
    title: 'Blockchain Developer',
    company: 'Coinbase',
    description: 'Build the crypto economy. Develop smart contracts, DeFi protocols, and trading infrastructure for the world\'s leading crypto platform.',
    requirements: ['Solidity', 'Ethereum/EVM', 'Web3.js', 'DeFi protocols', 'Security auditing'],
    salary: { min: 24, max: 45 },
    location: 'Remote',
    type: 'Full-time',
    domain: 'Backend Dev',
    tags: ['Blockchain', 'Solidity', 'Remote', 'Senior'],
  },
];

// ===== Run Seed =====
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Assign postedBy to jobs (use employer user)
    const employer = createdUsers.find(u => u.role === 'employer');
    const jobsWithPoster = jobs.map(job => ({ ...job, postedBy: employer._id }));

    // Insert jobs
    const createdJobs = await Job.insertMany(jobsWithPoster);
    console.log(`💼 Created ${createdJobs.length} jobs`);

    // Add some bookmarks to the jobseeker
    const jobseeker = createdUsers.find(u => u.role === 'jobseeker');
    jobseeker.bookmarkedJobs = [createdJobs[0]._id, createdJobs[2]._id, createdJobs[10]._id];
    await jobseeker.save();
    console.log('🔖 Added bookmarks to jobseeker');

    console.log('\n🎉 Seed complete!');
    console.log(`\n📋 Login credentials:`);
    console.log(`   Job Seeker: alex@example.com / password123`);
    console.log(`   Employer:   sarah@techcorp.com / password123`);
    console.log(`   Admin:      admin@jobpulse.ai / admin123`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
