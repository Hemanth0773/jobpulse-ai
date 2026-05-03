import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTarget, FiCpu, FiUsers, FiTrendingUp, FiFileText, FiSearch, FiMessageCircle, FiStar } from 'react-icons/fi';
import AnimatedSection, { StaggerContainer, StaggerItem } from '../components/animations/AnimatedSection';
import StatCard from '../components/cards/StatCard';
import DomainCard from '../components/cards/DomainCard';
import JobCard from '../components/cards/JobCard';
import Footer from '../components/layout/Footer';

const stats = [
  { icon: '💼', label: 'Jobs Available', value: '12500', suffix: '+', color: 'purple' },
  { icon: '👥', label: 'Active Users', value: '8400', suffix: '+', color: 'neon' },
  { icon: '✅', label: 'Success Rate', value: '94', suffix: '%', color: 'pink' },
  { icon: '🏢', label: 'Top Companies', value: '2100', suffix: '+', color: 'yellow' },
];

const domains = [
  { domain: 'UI/UX Design', jobCount: '320+' },
  { domain: 'Frontend Dev', jobCount: '540+' },
  { domain: 'Backend Dev', jobCount: '480+' },
  { domain: 'AI / ML', jobCount: '290+' },
  { domain: 'Data Science', jobCount: '350+' },
  { domain: 'DevOps', jobCount: '210+' },
  { domain: 'Mobile Dev', jobCount: '180+' },
  { domain: 'Cybersecurity', jobCount: '150+' },
];

const featuredJobs = [
  { _id: 'job_1', title: 'Senior React Developer', company: 'Google', location: 'Remote', type: 'Full-time', salary: { min: 18, max: 32 }, tags: ['React', 'TypeScript', 'Remote'] },
  { _id: 'job_2', title: 'AI/ML Engineer', company: 'OpenAI', location: 'San Francisco', type: 'Full-time', salary: { min: 25, max: 45 }, tags: ['Python', 'ML', 'On-site'] },
  { _id: 'job_3', title: 'Full Stack Developer', company: 'Netflix', location: 'Remote', type: 'Full-time', salary: { min: 20, max: 35 }, tags: ['Node.js', 'React', 'Remote'] },
  { _id: 'job_4', title: 'UI/UX Designer', company: 'Figma', location: 'New York', type: 'Hybrid', salary: { min: 15, max: 28 }, tags: ['Figma', 'Design', 'Hybrid'] },
  { _id: 'job_5', title: 'DevOps Engineer', company: 'AWS', location: 'Seattle', type: 'On-site', salary: { min: 22, max: 38 }, tags: ['AWS', 'Docker', 'K8s'] },
  { _id: 'job_6', title: 'Data Scientist', company: 'Meta', location: 'Remote', type: 'Full-time', salary: { min: 20, max: 40 }, tags: ['Python', 'SQL', 'Remote'] },
];

const aiFeatures = [
  {
    icon: <FiFileText size={28} />,
    title: 'AI Resume Analyzer',
    desc: 'Get your ATS score, skill extraction, improvement tips, and salary predictions powered by AI.',
    color: 'from-accent-purple to-accent-pink',
    glow: 'group-hover:shadow-neon-purple',
  },
  {
    icon: <FiSearch size={28} />,
    title: 'Smart Job Finder',
    desc: 'AI matches you with jobs based on your resume, skills, and career goals. No more endless scrolling.',
    color: 'from-accent-neon/80 to-accent-cyan',
    glow: 'group-hover:shadow-neon-green',
  },
  {
    icon: <FiMessageCircle size={28} />,
    title: 'AI Career Chatbot',
    desc: 'Get instant career guidance, interview prep, and personalized job suggestions 24/7.',
    color: 'from-accent-pink to-accent-yellow',
    glow: 'group-hover:shadow-neon-pink',
  },
  {
    icon: <FiUsers size={28} />,
    title: 'AI Team Builder',
    desc: 'Building a startup or hackathon team? AI suggests the perfect team composition for your project.',
    color: 'from-accent-blue to-accent-purple',
    glow: 'group-hover:shadow-neon-purple',
  },
];

export default function Landing() {
  return (
    <div className="page-container">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-purple w-[500px] h-[500px] -top-48 -left-48 opacity-20" data-speed="0.6" />
        <div className="orb orb-pink w-[400px] h-[400px] top-1/3 -right-48 opacity-15" data-speed="0.4" />
        <div className="orb orb-green w-[300px] h-[300px] bottom-20 left-1/4 opacity-10" data-speed="0.5" />
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple-light text-sm font-medium mb-6"
              >
                <FiZap size={14} className="text-accent-neon" />
                AI-Powered Career Platform
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-6">
                <span className="text-white">Join the</span>
                <br />
                <span className="gradient-text">Smart Job</span>
                <br />
                <span className="text-white">Community</span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/50 leading-relaxed mb-8 max-w-lg"
              >
                Discover opportunities matched by AI, optimize your resume with smart analysis, and accelerate your career with intelligent insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-glow text-base px-8 py-4 flex items-center gap-2"
                  >
                    Get Started Free
                    <FiArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link to="/jobs">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-outline-glow text-base px-8 py-4"
                  >
                    Browse Jobs
                  </motion.button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-10 flex items-center gap-6"
              >
                <div className="flex -space-x-3">
                  {['🧑‍💻', '👩‍💼', '🧑‍🎨', '👨‍🔬'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-navy-700 border-2 border-navy-900 flex items-center justify-center text-lg">
                      {emoji}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <FiStar key={i} size={14} className="text-accent-yellow fill-accent-yellow" />
                    ))}
                  </div>
                  <p className="text-sm text-white/40">Join 8,400+ professionals</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block" data-speed="0.85"
            >
              {/* Floating Cards */}
              <div className="relative">
                {/* Main Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="glass-card p-6 mb-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                      <FiTarget size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">ATS Score</h3>
                      <p className="text-white/40 text-xs">Resume Analysis</p>
                    </div>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-accent-neon font-display">87</span>
                    <span className="text-sm text-accent-neon/60 mb-1.5">/ 100</span>
                    <span className="ml-auto tag">+12 this week</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '87%' }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent-neon to-accent-cyan"
                    />
                  </div>
                </motion.div>

                {/* Skill Card */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="glass-card p-5 absolute -right-4 top-8 w-56"
                >
                  <h4 className="text-sm font-semibold text-white mb-3">Top Skills</h4>
                  <div className="space-y-2.5">
                    {[
                      { skill: 'React.js', level: 92, color: 'from-accent-cyan to-accent-blue' },
                      { skill: 'Python', level: 85, color: 'from-accent-neon/80 to-accent-cyan' },
                      { skill: 'Node.js', level: 78, color: 'from-accent-purple to-accent-pink' },
                    ].map((s) => (
                      <div key={s.skill}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-white/60">{s.skill}</span>
                          <span className="text-white/40">{s.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.05]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.level}%` }}
                            transition={{ duration: 1.5, delay: 1.5 }}
                            className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Job Match Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="glass-card p-4 mt-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-yellow to-accent-pink flex items-center justify-center text-white font-bold">
                    G
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white">Senior React Dev</h4>
                    <p className="text-xs text-white/40">Google • Remote • ₹18 LPA</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent-neon/10 text-accent-neon text-xs font-semibold">
                    95% Match
                  </span>
                </motion.div>

                {/* Notification popup */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 }}
                  className="glass-card p-3 absolute -left-8 bottom-4 flex items-center gap-2 w-52"
                >
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="text-xs font-medium text-white">Application Accepted!</p>
                    <p className="text-xs text-white/30">Netflix • 2m ago</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-accent-purple"
            />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="relative py-20 fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR DOMAINS ===== */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12 fade-up">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
              Explore Popular <span className="gradient-text">Domains</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Browse through top career domains and find positions that match your expertise
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 fade-up">
            {domains.map((d, i) => (
              <DomainCard key={d.domain} {...d} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED JOBS ===== */}
      <section className="relative py-20">
        <div className="absolute inset-0 gradient-bg-mesh pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection className="flex items-end justify-between mb-12 fade-up">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                Featured <span className="gradient-text">Opportunities</span>
              </h2>
              <p className="text-white/40 max-w-lg">
                Top positions from leading companies, handpicked for talent like you
              </p>
            </div>
            <Link to="/jobs" className="hidden sm:flex items-center gap-2 text-accent-purple-light hover:text-accent-purple transition-colors font-medium">
              View All <FiArrowRight />
            </Link>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-up">
            {featuredJobs.map((job, i) => (
              <JobCard key={job._id} job={job} delay={i * 0.08} />
            ))}
          </div>

          <Link to="/jobs" className="sm:hidden flex items-center justify-center gap-2 mt-8 text-accent-purple-light font-medium">
            View All Jobs <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ===== AI FEATURES ===== */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-16 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-neon/10 border border-accent-neon/20 text-accent-neon text-sm font-medium mb-6">
              <FiCpu size={14} />
              Powered by AI
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
              Your Career, <span className="gradient-text-neon">Supercharged</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Leverage cutting-edge AI tools to stand out, get hired faster, and build your dream career
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 gap-6 fade-up" staggerDelay={0.15}>
            {aiFeatures.map((feature, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={`
                    group relative overflow-hidden rounded-2xl p-8
                    bg-white/[0.03] backdrop-blur-xl
                    border border-white/[0.06]
                    hover:border-white/[0.12]
                    transition-all duration-500
                    ${feature.glow}
                    cursor-default
                  `}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 font-display">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed">{feature.desc}</p>

                  {/* Gradient hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="relative rounded-3xl overflow-hidden scale-in">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-pink/10 to-accent-neon/5" />
              <div className="absolute inset-0 backdrop-blur-3xl" />
              <div className="relative z-10 text-center py-16 px-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-neon-purple"
                >
                  <FiTrendingUp size={32} className="text-white" />
                </motion.div>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                  Ready to Level Up?
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  Join thousands of professionals using AI to accelerate their careers. It's free to start.
                </p>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-glow text-lg px-10 py-4"
                  >
                    Start Your Journey
                  </motion.button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
