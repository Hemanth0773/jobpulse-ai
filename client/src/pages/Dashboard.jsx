import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiBriefcase, FiFileText, FiClock, FiCheckCircle, FiArrowUpRight, FiStar, FiTarget } from 'react-icons/fi';
import Sidebar from '../components/layout/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import CircularProgress from '../components/ui/CircularProgress';
import JobCard from '../components/cards/JobCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { getJobs } from '../services/firestore';

// Fallback demo data so dashboard always looks premium
const demoJobs = [
  { _id: '1', title: 'Senior React Developer', company: 'Google', location: 'Remote', salary: { min: 18, max: 32 }, tags: ['React', 'Remote'] },
  { _id: '2', title: 'Full Stack Engineer', company: 'Stripe', location: 'SF', salary: { min: 20, max: 35 }, tags: ['Node.js', 'Hybrid'] },
  { _id: '3', title: 'UI Engineer', company: 'Vercel', location: 'Remote', salary: { min: 15, max: 28 }, tags: ['Next.js', 'Remote'] },
];

const demoActivity = [
  { id: 1, icon: <FiCheckCircle className="text-accent-neon" />, text: 'Application to Google viewed', time: '2h ago' },
  { id: 2, icon: <FiStar className="text-accent-yellow" />, text: 'Resume score improved to 87', time: '5h ago' },
  { id: 3, icon: <FiBriefcase className="text-accent-purple" />, text: 'New job match: Stripe', time: '1d ago' },
  { id: 4, icon: <FiFileText className="text-accent-pink" />, text: 'Resume updated successfully', time: '2d ago' },
];

const demoSkills = [
  { name: 'React.js', level: 92, color: 'from-accent-cyan to-accent-blue' },
  { name: 'TypeScript', level: 85, color: 'from-accent-purple to-accent-pink' },
  { name: 'Node.js', level: 78, color: 'from-accent-neon/80 to-accent-cyan' },
  { name: 'Python', level: 70, color: 'from-accent-yellow to-accent-pink' },
  { name: 'MongoDB', level: 65, color: 'from-accent-pink to-accent-purple' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState(null);
  const [apiActivity, setApiActivity] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    fetchJobs();
    // Use user data from auth context for notifications
    if (user?.notifications?.length > 0) {
      setApiActivity(user.notifications.slice(0, 4));
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const data = await getJobs({ limitCount: 3 });
      if (data.jobs?.length > 0) setRecommendedJobs(data.jobs);
    } catch { /* will use demo data */ }
  };

  // Use API data if available, otherwise demo
  const jobs = recommendedJobs || demoJobs;
  const score = resumeData?.atsScore ?? 87;
  const displayName = user?.name?.split(' ')[0] || 'Alex';

  const skills = useMemo(() => {
    if (resumeData?.extractedSkills?.length > 0) {
      const colors = [
        'from-accent-cyan to-accent-blue',
        'from-accent-purple to-accent-pink',
        'from-accent-neon/80 to-accent-cyan',
        'from-accent-yellow to-accent-pink',
        'from-accent-pink to-accent-purple',
      ];
      return resumeData.extractedSkills.slice(0, 5).map((s, i) => ({
        name: s, level: 95 - i * 6, color: colors[i % colors.length],
      }));
    }
    if (user?.skills?.length > 0) {
      const colors = [
        'from-accent-cyan to-accent-blue',
        'from-accent-purple to-accent-pink',
        'from-accent-neon/80 to-accent-cyan',
        'from-accent-yellow to-accent-pink',
        'from-accent-pink to-accent-purple',
      ];
      return user.skills.slice(0, 5).map((s, i) => ({
        name: s, level: 90 - i * 5, color: colors[i % colors.length],
      }));
    }
    return demoSkills;
  }, [resumeData, user]);

  const activity = apiActivity
    ? apiActivity.map((a, i) => ({
        id: a._id || i,
        icon: <FiStar className="text-accent-purple" />,
        text: a.text,
        time: new Date(a.createdAt).toLocaleDateString(),
      }))
    : demoActivity;

  return (
    <div className="page-container pt-20 min-h-screen">
      <Sidebar />

      <main className="lg:pl-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Welcome Banner */}
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-2xl p-8 mb-8 bg-gradient-to-r from-accent-purple/15 via-accent-pink/10 to-accent-neon/5 border border-white/[0.06]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent-purple/10 to-transparent rounded-bl-full" />
              <div className="relative z-10">
                <h1 className="text-3xl font-bold font-display text-white mb-2">
                  Welcome back, <span className="gradient-text">{displayName}</span> 👋
                </h1>
                <p className="text-white/50">
                  Here's what's happening with your career journey today
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: <FiBriefcase />, label: 'Applications', value: '12', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
              { icon: <FiCheckCircle />, label: 'Interviews', value: '3', color: 'text-accent-neon', bg: 'bg-accent-neon/10' },
              { icon: <FiClock />, label: 'Pending', value: '7', color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
              { icon: <FiTrendingUp />, label: 'Profile Views', value: '148', color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
            ].map((stat, i) => (
              <GlassCard key={i} delay={i * 0.1} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} text-xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-white font-display">{stat.value}</p>
                  <p className="text-sm text-white/40">{stat.label}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* ATS Score */}
            <GlassCard delay={0.2} className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <FiTarget className="text-accent-purple" size={20} />
                <h3 className="text-lg font-semibold text-white">ATS Score</h3>
              </div>
              <div className="flex justify-center mb-4">
                <CircularProgress value={score} delay={0.5} />
              </div>
              <div className="text-center">
                <p className="text-sm text-white/40 mb-3">
                  {score > 80 ? 'Your resume is well-optimized!' : score > 50 ? 'Room for improvement.' : 'Upload your resume for analysis.'}
                </p>
                <Link to="/resume">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-accent-purple-light hover:text-accent-purple font-medium flex items-center gap-1 mx-auto"
                  >
                    Improve Score <FiArrowUpRight size={14} />
                  </motion.button>
                </Link>
              </div>
            </GlassCard>

            {/* Skill Analysis */}
            <GlassCard delay={0.3} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-accent-neon" size={20} />
                  <h3 className="text-lg font-semibold text-white">Skill Analysis</h3>
                </div>
                <span className="tag">{skills.length} skills tracked</span>
              </div>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-white/70 font-medium">{skill.name}</span>
                      <span className="text-sm text-white/40">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Recommended Jobs */}
          <AnimatedSection delay={0.2} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white font-display">Recommended for You</h3>
              <Link to="/jobs">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-sm text-accent-purple-light font-medium flex items-center gap-1"
                >
                  View All <FiArrowUpRight size={14} />
                </motion.button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map((job, i) => (
                <JobCard key={job._id} job={job} delay={i * 0.1} />
              ))}
            </div>
          </AnimatedSection>

          {/* Recent Activity */}
          <AnimatedSection delay={0.3}>
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiClock size={18} className="text-accent-purple" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {activity.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                      {item.icon}
                    </div>
                    <p className="text-sm text-white/70 flex-1">{item.text}</p>
                    <span className="text-xs text-white/30">{item.time}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </main>
    </div>
  );
}
