import { motion } from 'framer-motion';
import { FiBookmark, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toggleBookmark } from '../../services/firestore';

// Map company names to their actual domains for accurate favicon fetching
const COMPANY_DOMAINS = {
  'google': 'google.com',
  'openai': 'openai.com',
  'netflix': 'netflix.com',
  'figma': 'figma.com',
  'aws': 'aws.amazon.com',
  'meta': 'meta.com',
  'spotify': 'spotify.com',
  'apple': 'apple.com',
  'microsoft': 'microsoft.com',
  'deepmind': 'deepmind.google',
  'vercel': 'vercel.com',
  'crowdstrike': 'crowdstrike.com',
  'stripe': 'stripe.com',
  'samsung': 'samsung.com',
  'coinbase': 'coinbase.com',
};

function CompanyLogo({ company, colorClass }) {
  const [showFallback, setShowFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const companyKey = (company || '').toLowerCase().replace(/\s+/g, '');
  const domain = COMPANY_DOMAINS[companyKey] || `${companyKey}.com`;
  const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (showFallback) {
    return (
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
        {company?.charAt(0) || 'C'}
      </div>
    );
  }

  return (
    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
      <img
        src={logoUrl}
        alt={company}
        className={`w-9 h-9 object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => {
          // Google returns a 16x16 default globe if domain has no favicon — reject those
          if (e.target.naturalWidth <= 16) {
            setShowFallback(true);
          } else {
            setLoaded(true);
          }
        }}
        onError={() => setShowFallback(true)}
      />
      {!loaded && !showFallback && (
        <span className="absolute text-white font-bold text-lg">{company?.charAt(0) || 'C'}</span>
      )}
    </div>
  );
}

export default function JobCard({ job, delay = 0, isBookmarked = false }) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      const jobId = job?._id || job?.id;
      const updatedBookmarks = await toggleBookmark(user.uid, jobId);
      setBookmarked(updatedBookmarks.includes(jobId));
    } catch (err) {
      console.error('Bookmark error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/jobs/${job?._id || job?.id}`);
  };

  const companyColors = [
    'from-accent-purple to-accent-pink',
    'from-accent-neon/80 to-accent-cyan',
    'from-accent-yellow to-accent-pink',
    'from-accent-blue to-accent-purple',
    'from-accent-pink to-accent-yellow',
    'from-accent-cyan to-accent-neon/80',
  ];

  const colorIndex = (job?.title?.length || 0) % companyColors.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/jobs/${job?._id || job?.id}`)}
      className="
        relative group rounded-2xl overflow-hidden
        bg-white/[0.04] dark:bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06] dark:border-white/[0.06]
        hover:border-accent-purple/30
        hover:shadow-card-hover
        transition-all duration-500
        cursor-pointer
      "
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/10 via-accent-pink/5 to-accent-purple/10 rounded-2xl blur-xl" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <CompanyLogo company={job?.company} colorClass={companyColors[colorIndex]} />
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-white group-hover:text-accent-purple-light transition-colors duration-300 leading-tight">
                {job?.title || 'Software Engineer'}
              </h3>
              <p className="text-accent-purple-light/70 text-sm font-medium mt-0.5">
                {job?.company || 'Tech Corp'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            disabled={saving}
            className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
              bookmarked
                ? 'bg-accent-purple/20 text-accent-purple'
                : 'bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10'
            } ${saving ? 'opacity-50 cursor-wait' : ''}`}
          >
            <FiBookmark className={bookmarked ? 'fill-current' : ''} size={18} />
          </motion.button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(job?.tags || ['Remote', 'Full-time']).slice(0, 3).map((tag, i) => (
            <span key={i} className="tag text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-white/40 mb-5">
          <span className="flex items-center gap-1.5">
            <FiMapPin size={14} />
            {job?.location || 'Remote'}
          </span>
          <span className="flex items-center gap-1.5">
            <FiClock size={14} />
            {job?.type || 'Full-time'}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-accent-neon font-semibold">
            <span>₹</span>
            <span>{job?.salary?.min || 5} - {job?.salary?.max || 15} LPA</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, x: 3 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
            className="px-4 py-2 rounded-xl bg-white/[0.06] text-accent-purple-light text-sm font-semibold hover:bg-accent-purple/15 transition-all duration-300 flex items-center gap-1.5"
          >
            View Details <FiArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
