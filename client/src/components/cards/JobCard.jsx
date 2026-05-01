import { motion } from 'framer-motion';
import { FiBookmark, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toggleBookmark } from '../../services/firestore';

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
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${companyColors[colorIndex]} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {job?.company?.charAt(0) || 'C'}
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBookmark}
            disabled={saving}
            className={`p-2 rounded-lg transition-all duration-300 ${
              bookmarked
                ? 'bg-accent-purple/20 text-accent-purple'
                : 'bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10'
            } ${saving ? 'opacity-50 cursor-wait' : ''}`}
          >
            <FiBookmark className={bookmarked ? 'fill-current' : ''} size={18} />
          </motion.button>
        </div>

        {/* Job Info */}
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-accent-purple-light transition-colors duration-300">
          {job?.title || 'Software Engineer'}
        </h3>
        <p className="text-white/50 text-sm font-medium mb-3">{job?.company || 'Tech Corp'}</p>

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
