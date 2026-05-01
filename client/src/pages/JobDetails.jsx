import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiCalendar, FiArrowLeft, FiBookmark, FiShare2, FiCheckCircle, FiBriefcase, FiAward, FiUsers } from 'react-icons/fi';
import GlassCard from '../components/ui/GlassCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import Footer from '../components/layout/Footer';
import { getJobById, applyToJob, toggleBookmark, getUserProfile } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

// Fallback job data matching our IDs
const fallbackJobs = {
  'job_1': {
    _id: 'job_1', title: 'Senior React Developer', company: 'Google', location: 'Remote', type: 'Full-time',
    salary: { min: 18, max: 32 }, tags: ['React', 'TypeScript', 'Remote', 'Senior'],
    domain: 'Frontend Dev',
    description: 'We are looking for an experienced React developer to join our core team building next-generation web applications used by billions of people worldwide. You will work on Google Workspace products including Gmail, Drive, and Docs, pushing the boundaries of what is possible on the web.\n\nAs part of the frontend engineering team, you will collaborate closely with designers, product managers, and backend engineers to deliver pixel-perfect, performant user interfaces. You will also mentor junior developers and contribute to our shared component library.',
    requirements: ['5+ years of professional React.js experience', 'Expert knowledge of TypeScript and modern JavaScript', 'Experience with performance optimization and profiling', 'Strong understanding of testing (Jest, React Testing Library)', 'Familiarity with CI/CD pipelines and DevOps practices', 'Experience with state management (Redux, Zustand, or similar)', 'Strong communication and collaboration skills'],
    responsibilities: ['Design and implement complex UI features for Google Workspace', 'Optimize application performance for millions of concurrent users', 'Write clean, maintainable, and well-tested code', 'Participate in code reviews and architectural discussions', 'Mentor junior engineers and contribute to team growth', 'Collaborate with cross-functional teams to define product direction'],
    perks: ['Competitive salary + equity', 'Health, dental, and vision insurance', 'Unlimited PTO', 'Home office stipend ($2,000)', 'Learning & development budget ($5,000/yr)', 'Free meals at office cafeterias'],
    eligibility: 'Bachelor\'s degree in Computer Science or equivalent experience. Must have 5+ years of professional frontend development experience with React.js.',
    startDate: 'Immediate', applyBy: '2026-05-15',
  },
  'job_2': {
    _id: 'job_2', title: 'AI/ML Engineer', company: 'OpenAI', location: 'San Francisco', type: 'Full-time',
    salary: { min: 25, max: 45 }, tags: ['Python', 'ML', 'On-site', 'Senior'],
    domain: 'AI / ML',
    description: 'Join the team building the future of artificial intelligence. Work on large language models, reinforcement learning, and cutting-edge research that shapes the industry.\n\nYou will be responsible for training, fine-tuning, and deploying state-of-the-art machine learning models. This role offers a unique opportunity to work at the forefront of AI research with some of the brightest minds in the field.',
    requirements: ['MS/PhD in Computer Science, Machine Learning, or related field', 'Strong proficiency in PyTorch or TensorFlow', 'Experience with NLP, computer vision, or reinforcement learning', 'Strong mathematical and statistical foundations', 'Published research papers preferred', 'Experience with distributed training at scale'],
    responsibilities: ['Research and develop novel ML architectures', 'Train and optimize large-scale models', 'Collaborate with the safety and alignment team', 'Write research papers and present findings', 'Build tools and infrastructure for ML experiments', 'Contribute to open-source projects'],
    perks: ['Top-tier compensation + generous equity', 'Health, dental, vision, and mental health support', 'Annual conference budget', 'Relocation assistance', 'Daily catered meals', 'Gym membership'],
    eligibility: 'Advanced degree (MS/PhD) in CS, ML, or related quantitative field. 3+ years of experience in ML research or engineering.',
    startDate: '2026-06-01', applyBy: '2026-05-20',
  },
  'job_3': {
    _id: 'job_3', title: 'Full Stack Developer', company: 'Netflix', location: 'Remote', type: 'Full-time',
    salary: { min: 20, max: 35 }, tags: ['Node.js', 'React', 'Remote', 'Mid-Senior'],
    domain: 'Backend Dev',
    description: 'Build and maintain the platforms that deliver entertainment to 200M+ subscribers worldwide. Work with microservices, React, and Node.js at massive scale.\n\nYou will be part of a team that builds the core streaming infrastructure, ensuring high availability and low latency for users around the globe. This is a unique opportunity to solve complex distributed systems challenges.',
    requirements: ['Strong React + Node.js skills', '3+ years of professional experience', 'Experience with microservices architecture', 'Cloud experience (AWS/GCP)', 'Strong problem-solving abilities', 'Experience with GraphQL is a plus'],
    responsibilities: ['Build and scale streaming platform services', 'Design and implement RESTful and GraphQL APIs', 'Ensure high availability with 99.99% uptime', 'Optimize for performance and user experience', 'Collaborate with content and product teams', 'Participate in on-call rotations'],
    perks: ['Unlimited PTO', 'Stock options', 'Top-of-market salary', 'Remote work flexibility', 'Annual wellness stipend', 'Free Netflix subscription (obviously)'],
    eligibility: 'Bachelor\'s degree in CS or equivalent. 3+ years full-stack development experience.',
    startDate: 'Immediate', applyBy: '2026-05-25',
  },
  'job_4': {
    _id: 'job_4', title: 'UI/UX Designer', company: 'Figma', location: 'New York', type: 'Hybrid',
    salary: { min: 15, max: 28 }, tags: ['Figma', 'Design', 'Hybrid', 'Mid-level'],
    domain: 'UI/UX Design',
    description: 'Design the tools that designers use. Work on Figma\'s core product experience, creating intuitive interfaces for millions of creative professionals.\n\nAs a UI/UX Designer, you\'ll work closely with engineering and product teams to define the future of collaborative design tools. You\'ll conduct user research, create prototypes, and iterate on designs.',
    requirements: ['Expert Figma skills', 'Strong user research methodology', '3+ years UX design experience', 'Experience building design systems', 'Prototyping and interaction design', 'Strong visual design skills'],
    responsibilities: ['Design new features for the Figma platform', 'Conduct user research and usability testing', 'Create and maintain design system components', 'Collaborate with engineers on implementation', 'Present design decisions to stakeholders', 'Iterate based on user feedback and data'],
    perks: ['Competitive salary', 'Equity package', 'Flexible hybrid schedule', 'Design conference budget', 'Home office setup allowance', 'Health and wellness benefits'],
    eligibility: 'Bachelor\'s degree in Design, HCI, or related field. Portfolio demonstrating strong UX process.',
    startDate: '2026-06-15', applyBy: '2026-05-30',
  },
  'job_5': {
    _id: 'job_5', title: 'DevOps Engineer', company: 'AWS', location: 'Seattle', type: 'On-site',
    salary: { min: 22, max: 38 }, tags: ['AWS', 'Docker', 'K8s', 'Senior'],
    domain: 'DevOps',
    description: 'Help customers architect and deploy cloud solutions at scale. Build internal tools and automation for AWS infrastructure services.\n\nYou\'ll work with some of the largest companies in the world to design, deploy, and manage their cloud infrastructure on AWS.',
    requirements: ['AWS certified (Solutions Architect preferred)', 'Expert Docker/Kubernetes knowledge', 'Terraform and IaC experience', 'CI/CD pipeline design', 'Linux systems administration', 'Scripting (Python, Bash)'],
    responsibilities: ['Design and implement cloud architectures', 'Automate infrastructure provisioning', 'Monitor and optimize cloud costs', 'Implement security best practices', 'Troubleshoot production issues', 'Create documentation and runbooks'],
    perks: ['Competitive salary + RSUs', 'Comprehensive healthcare', 'Relocation package', '401(k) matching', 'Learning and certification support', 'Employee discounts on AWS'],
    eligibility: '5+ years DevOps/SRE experience. Strong cloud architecture background.',
    startDate: 'Immediate', applyBy: '2026-06-01',
  },
  'job_6': {
    _id: 'job_6', title: 'Data Scientist', company: 'Meta', location: 'Remote', type: 'Full-time',
    salary: { min: 20, max: 40 }, tags: ['Python', 'SQL', 'Remote', 'Mid-Senior'],
    domain: 'Data Science',
    description: 'Drive product decisions through data analysis across Facebook, Instagram, and WhatsApp. Build ML models to improve user experience for billions of people.\n\nYou will work with product teams to define metrics, design experiments, and build predictive models that directly impact product strategy.',
    requirements: ['Strong Python and R skills', 'Advanced SQL mastery', 'Statistical modeling expertise', 'A/B testing and experiment design', 'Clear communication of technical results', 'Experience with big data tools (Spark, Hive)'],
    responsibilities: ['Analyze large-scale datasets to find insights', 'Design and analyze A/B experiments', 'Build predictive models for product features', 'Present findings to leadership', 'Partner with engineering to productionize models', 'Define success metrics for new features'],
    perks: ['Remote work flexibility', 'RSU compensation', 'Health and wellness benefits', 'Annual learning budget', 'Parental leave', 'Mental health support'],
    eligibility: 'MS in Statistics, CS, or quantitative field. 3+ years data science experience.',
    startDate: '2026-07-01', applyBy: '2026-06-10',
  },
};

// Generate fallback for IDs 7-15
for (let i = 7; i <= 15; i++) {
  fallbackJobs[`job_${i}`] = {
    ...fallbackJobs['job_1'],
    _id: `job_${i}`,
    title: ['Backend Engineer', 'iOS Developer', 'Cloud Architect', 'ML Research Scientist', 'Frontend Engineer', 'Security Engineer', 'Product Manager', 'Android Developer', 'Blockchain Developer'][i - 7],
    company: ['Spotify', 'Apple', 'Microsoft', 'DeepMind', 'Vercel', 'CrowdStrike', 'Stripe', 'Samsung', 'Coinbase'][i - 7],
  };
}

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkSaving, setBookmarkSaving] = useState(false);

  useEffect(() => {
    fetchJob();
    if (user?.uid) checkBookmarkStatus();
  }, [id, user?.uid]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const data = await getJobById(id);
      if (data) {
        setJob(data);
        setLoading(false);
        return;
      }
    } catch { /* use fallback */ }
    // Fallback to local data
    setJob(fallbackJobs[id] || fallbackJobs['job_1']);
    setLoading(false);
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await applyToJob(user.uid, id);
      setApplied(true);
      setTimeout(() => navigate('/apply-success'), 1200);
    } catch (err) {
      if (err.message === 'Already applied to this job') {
        setApplied(true);
      } else {
        alert(err.message);
      }
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      if (profile?.bookmarkedJobs?.includes(id)) {
        setBookmarked(true);
      }
    } catch { /* ignore */ }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (bookmarkSaving) return;
    setBookmarkSaving(true);
    try {
      const updatedBookmarks = await toggleBookmark(user.uid, id);
      setBookmarked(updatedBookmarks.includes(id));
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setBookmarkSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container pt-20 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page-container pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-lg">Job not found</p>
        <Link to="/jobs" className="btn-outline-glow text-sm">Back to Jobs</Link>
      </div>
    );
  }

  const companyColors = ['from-accent-purple to-accent-pink', 'from-accent-neon/80 to-accent-cyan', 'from-accent-yellow to-accent-pink', 'from-accent-blue to-accent-purple', 'from-accent-pink to-accent-yellow', 'from-accent-cyan to-accent-neon/80'];
  const colorIndex = (job.title?.length || 0) % companyColors.length;

  return (
    <div className="page-container pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back button */}
        <AnimatedSection>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
            <FiArrowLeft size={16} /> Back to Jobs
          </button>
        </AnimatedSection>

        {/* Header Card */}
        <AnimatedSection delay={0.1}>
          <GlassCard hover={false} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              {/* Company Logo */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${companyColors[colorIndex]} flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg flex-shrink-0`}>
                {job.company?.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">{job.title}</h1>
                <p className="text-lg text-accent-purple-light font-medium mb-4">{job.company}</p>

                <div className="flex flex-wrap gap-3 text-sm text-white/50">
                  <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                    <FiMapPin size={14} className="text-accent-pink" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                    <FiClock size={14} className="text-accent-cyan" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/[0.04] px-3 py-1.5 rounded-lg">
                    <FiBriefcase size={14} className="text-accent-neon" /> {job.domain || 'General'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  disabled={bookmarkSaving}
                  className={`p-3 rounded-xl transition-all ${bookmarked ? 'bg-accent-purple/20 text-accent-purple' : 'bg-white/[0.05] text-white/40 hover:text-white/70'}`}
                >
                  <FiBookmark className={bookmarked ? 'fill-current' : ''} size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-white/[0.05] text-white/40 hover:text-white/70 transition-all"
                >
                  <FiShare2 size={20} />
                </motion.button>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
              <div>
                <p className="text-xs text-white/40 mb-1">Salary</p>
                <p className="text-accent-neon font-semibold">₹ {job.salary?.min} - {job.salary?.max} LPA</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Start Date</p>
                <p className="text-white font-medium text-sm">{job.startDate || 'Immediate'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Apply By</p>
                <p className="text-white font-medium text-sm">{job.applyBy ? new Date(job.applyBy).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Open'}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Applicants</p>
                <p className="text-white font-medium text-sm flex items-center gap-1"><FiUsers size={14} /> {job.applicants?.length || Math.floor(Math.random() * 80 + 20)}+</p>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* About the Job */}
        <AnimatedSection delay={0.2}>
          <GlassCard hover={false} className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 font-display flex items-center gap-2">
              <FiBriefcase className="text-accent-purple" /> About the Job
            </h2>
            <div className="text-white/60 leading-relaxed whitespace-pre-line text-sm">
              {job.description || 'No description provided.'}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Responsibilities */}
        {job.responsibilities && (
          <AnimatedSection delay={0.25}>
            <GlassCard hover={false} className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 font-display">Key Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-3 text-sm text-white/60"
                  >
                    <FiCheckCircle className="text-accent-neon mt-0.5 flex-shrink-0" size={16} />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Requirements */}
        {job.requirements && (
          <AnimatedSection delay={0.3}>
            <GlassCard hover={false} className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 font-display">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    className="flex items-start gap-3 text-sm text-white/60"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple mt-2 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Skills Required */}
        <AnimatedSection delay={0.35}>
          <GlassCard hover={false} className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 font-display">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {(job.tags || []).map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="tag text-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </GlassCard>
        </AnimatedSection>

        {/* Perks */}
        {job.perks && (
          <AnimatedSection delay={0.4}>
            <GlassCard hover={false} className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 font-display flex items-center gap-2">
                <FiAward className="text-accent-yellow" /> Perks & Benefits
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {job.perks.map((perk, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03]"
                  >
                    <span className="text-accent-neon">✦</span>
                    <span className="text-sm text-white/60">{perk}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Eligibility */}
        {job.eligibility && (
          <AnimatedSection delay={0.45}>
            <GlassCard hover={false} className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3 font-display">Who Can Apply</h2>
              <p className="text-sm text-white/60 leading-relaxed">{job.eligibility}</p>
            </GlassCard>
          </AnimatedSection>
        )}

        {/* Apply Button */}
        <AnimatedSection delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center gap-4 py-8">
            {!applied ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleApply}
                className="btn-glow text-lg px-12 py-4 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Apply Now <FiArrowLeft className="rotate-180" size={18} />
              </motion.button>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-accent-neon/10 border border-accent-neon/20 text-accent-neon font-semibold"
              >
                <FiCheckCircle size={20} /> Application Submitted!
              </motion.div>
            )}
            <button
              onClick={handleBookmark}
              disabled={bookmarkSaving}
              className={`px-8 py-4 rounded-xl border text-sm font-semibold transition-all w-full sm:w-auto flex items-center justify-center gap-2 ${
                bookmarked
                  ? 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple'
                  : 'border-white/10 text-white/50 hover:border-accent-purple/30 hover:text-accent-purple'
              }`}
            >
              <FiBookmark className={bookmarked ? 'fill-current' : ''} size={16} />
              {bookmarked ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </div>
  );
}
