import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/cards/JobCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import Footer from '../components/layout/Footer';
import { getJobs } from '../services/firestore';

// Fallback data so jobs page never shows empty
const fallbackJobs = [
  { _id: 'job_1', title: 'Senior React Developer', company: 'Google', location: 'Remote', type: 'Full-time', domain: 'Frontend Dev', salary: { min: 18, max: 32 }, tags: ['React', 'TypeScript', 'Remote'] },
  { _id: 'job_2', title: 'AI/ML Engineer', company: 'OpenAI', location: 'San Francisco', type: 'Full-time', domain: 'AI / ML', salary: { min: 25, max: 45 }, tags: ['Python', 'ML', 'On-site'] },
  { _id: 'job_3', title: 'Full Stack Developer', company: 'Netflix', location: 'Remote', type: 'Full-time', domain: 'Backend Dev', salary: { min: 20, max: 35 }, tags: ['Node.js', 'React', 'Remote'] },
  { _id: 'job_4', title: 'UI/UX Designer', company: 'Figma', location: 'New York', type: 'Hybrid', domain: 'UI/UX Design', salary: { min: 15, max: 28 }, tags: ['Figma', 'Design', 'Hybrid'] },
  { _id: 'job_5', title: 'DevOps Engineer', company: 'AWS', location: 'Seattle', type: 'On-site', domain: 'DevOps', salary: { min: 22, max: 38 }, tags: ['AWS', 'Docker', 'K8s'] },
  { _id: 'job_6', title: 'Data Scientist', company: 'Meta', location: 'Remote', type: 'Full-time', domain: 'Data Science', salary: { min: 20, max: 40 }, tags: ['Python', 'SQL', 'Remote'] },
  { _id: 'job_7', title: 'Backend Engineer', company: 'Spotify', location: 'London', type: 'Hybrid', domain: 'Backend Dev', salary: { min: 16, max: 30 }, tags: ['Java', 'Microservices', 'Hybrid'] },
  { _id: 'job_8', title: 'iOS Developer', company: 'Apple', location: 'Cupertino', type: 'On-site', domain: 'Mobile Dev', salary: { min: 22, max: 40 }, tags: ['Swift', 'iOS', 'On-site'] },
  { _id: 'job_9', title: 'Cloud Architect', company: 'Microsoft', location: 'Remote', type: 'Full-time', domain: 'DevOps', salary: { min: 28, max: 50 }, tags: ['Azure', 'Cloud', 'Remote'] },
  { _id: 'job_10', title: 'ML Research Scientist', company: 'DeepMind', location: 'London', type: 'Full-time', domain: 'AI / ML', salary: { min: 30, max: 55 }, tags: ['PyTorch', 'Research', 'On-site'] },
  { _id: 'job_11', title: 'Frontend Engineer', company: 'Vercel', location: 'Remote', type: 'Full-time', domain: 'Frontend Dev', salary: { min: 15, max: 28 }, tags: ['Next.js', 'React', 'Remote'] },
  { _id: 'job_12', title: 'Security Engineer', company: 'CrowdStrike', location: 'Austin', type: 'Hybrid', domain: 'Cybersecurity', salary: { min: 20, max: 38 }, tags: ['Security', 'Python', 'Hybrid'] },
  { _id: 'job_13', title: 'Product Manager', company: 'Stripe', location: 'San Francisco', type: 'Hybrid', domain: 'General', salary: { min: 22, max: 42 }, tags: ['Product', 'Fintech', 'Hybrid'] },
  { _id: 'job_14', title: 'Android Developer', company: 'Samsung', location: 'Bangalore', type: 'On-site', domain: 'Mobile Dev', salary: { min: 14, max: 26 }, tags: ['Kotlin', 'Android', 'On-site'] },
  { _id: 'job_15', title: 'Blockchain Developer', company: 'Coinbase', location: 'Remote', type: 'Full-time', domain: 'Backend Dev', salary: { min: 24, max: 45 }, tags: ['Blockchain', 'Solidity', 'Remote'] },
];

const domains = ['All', 'Frontend Dev', 'Backend Dev', 'AI / ML', 'Data Science', 'DevOps', 'UI/UX Design', 'Mobile Dev', 'Cybersecurity'];
const types = ['All', 'Full-time', 'Part-time', 'Hybrid', 'On-site', 'Remote'];

export default function JobListings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || 'All');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [showFilters, setShowFilters] = useState(!!searchParams.get('domain') || !!searchParams.get('type'));
  const [allJobs, setAllJobs] = useState(fallbackJobs);
  const [loading, setLoading] = useState(true);

  // Fetch from backend, fallback to local data
  useEffect(() => {
    fetchJobs();
  }, []);

  // Sync domain from URL query params
  useEffect(() => {
    const domainParam = searchParams.get('domain');
    if (domainParam) {
      // Match URL param to our domain list (case-insensitive)
      const match = domains.find(d => d.toLowerCase() === domainParam.toLowerCase());
      if (match) {
        setSelectedDomain(match);
        setShowFilters(true);
      }
    }
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs({ limitCount: 50 });
      if (data.jobs?.length > 0) {
        setAllJobs(data.jobs);
      }
    } catch { /* use fallback */ }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return allJobs.filter(job => {
      const matchSearch = !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        (job.tags || []).some(tag => tag.toLowerCase().includes(search.toLowerCase()));

      const matchDomain = selectedDomain === 'All' || job.domain === selectedDomain;

      const matchType = selectedType === 'All' ||
        job.type === selectedType ||
        (selectedType === 'Remote' && (job.tags || []).includes('Remote'));

      return matchSearch && matchDomain && matchType;
    });
  }, [search, selectedDomain, selectedType, allJobs]);

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain);
    if (domain === 'All') {
      searchParams.delete('domain');
    } else {
      searchParams.set('domain', domain);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSelectedDomain('All');
    setSelectedType('All');
    setSearch('');
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="page-container pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <AnimatedSection className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            Find Your <span className="gradient-text">Dream Job</span>
          </h1>
          <p className="text-white/40">Discover {allJobs.length}+ opportunities from top companies</p>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection delay={0.1} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, skills..."
                className="input-glass pl-12 py-4 text-base"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`
                px-5 py-4 rounded-xl flex items-center gap-2 font-medium text-sm transition-all
                ${showFilters
                  ? 'bg-accent-purple/20 text-accent-purple-light border border-accent-purple/30'
                  : 'bg-white/[0.05] text-white/60 border border-white/[0.06] hover:bg-white/[0.08]'}
              `}
            >
              <FiFilter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="glass-card p-6 space-y-4">
              <div>
                <label className="text-sm text-white/50 mb-2 block">Domain</label>
                <div className="flex flex-wrap gap-2">
                  {domains.map(d => (
                    <button
                      key={d}
                      onClick={() => handleDomainChange(d)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedDomain === d
                          ? 'bg-accent-purple/20 text-accent-purple-light border border-accent-purple/30'
                          : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white/70'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-white/50 mb-2 block">Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedType === t
                          ? 'bg-accent-purple/20 text-accent-purple-light border border-accent-purple/30'
                          : 'bg-white/[0.04] text-white/50 border border-white/[0.06] hover:text-white/70'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">
            Showing <span className="text-white font-medium">{filtered.length}</span> jobs
            {selectedDomain !== 'All' && <span className="text-accent-purple-light"> in {selectedDomain}</span>}
          </p>
          {(selectedDomain !== 'All' || selectedType !== 'All' || search) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-accent-purple-light hover:text-accent-purple flex items-center gap-1"
            >
              <FiX size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl skeleton" />
                  <div className="w-8 h-8 rounded-lg skeleton" />
                </div>
                <div className="w-3/4 h-5 skeleton" />
                <div className="w-1/2 h-4 skeleton" />
                <div className="flex gap-2">
                  <div className="w-16 h-6 rounded-full skeleton" />
                  <div className="w-16 h-6 rounded-full skeleton" />
                </div>
                <div className="w-full h-4 skeleton" />
                <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                  <div className="w-24 h-5 skeleton" />
                  <div className="w-24 h-8 rounded-xl skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((job, i) => (
              <JobCard key={job._id} job={job} delay={i * 0.05} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-white/40 mb-6">Try adjusting your filters or search terms</p>
            <button onClick={handleClearFilters} className="btn-outline-glow text-sm px-6 py-3">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
