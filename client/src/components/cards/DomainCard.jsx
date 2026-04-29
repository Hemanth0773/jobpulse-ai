import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const domainIcons = {
  'UI/UX Design': '🎨',
  'Frontend Dev': '⚛️',
  'Backend Dev': '🔧',
  'AI / ML': '🤖',
  'Data Science': '📊',
  'DevOps': '☁️',
  'Mobile Dev': '📱',
  'Cybersecurity': '🔒',
};

const domainColors = {
  'UI/UX Design': 'from-accent-pink/20 to-accent-purple/10 border-accent-pink/20 hover:border-accent-pink/40',
  'Frontend Dev': 'from-accent-cyan/20 to-accent-blue/10 border-accent-cyan/20 hover:border-accent-cyan/40',
  'Backend Dev': 'from-accent-neon/20 to-accent-cyan/10 border-accent-neon/20 hover:border-accent-neon/40',
  'AI / ML': 'from-accent-purple/20 to-accent-pink/10 border-accent-purple/20 hover:border-accent-purple/40',
  'Data Science': 'from-accent-yellow/20 to-accent-pink/10 border-accent-yellow/20 hover:border-accent-yellow/40',
  'DevOps': 'from-accent-blue/20 to-accent-neon/10 border-accent-blue/20 hover:border-accent-blue/40',
  'Mobile Dev': 'from-accent-pink/20 to-accent-yellow/10 border-accent-pink/20 hover:border-accent-pink/40',
  'Cybersecurity': 'from-accent-neon/20 to-accent-purple/10 border-accent-neon/20 hover:border-accent-neon/40',
};

export default function DomainCard({ domain, jobCount, delay = 0 }) {
  const navigate = useNavigate();
  const icon = domainIcons[domain] || '💼';
  const colorClass = domainColors[domain] || 'from-accent-purple/20 to-accent-purple/10 border-accent-purple/20 hover:border-accent-purple/40';

  const handleClick = () => {
    navigate(`/jobs?domain=${encodeURIComponent(domain)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -10, scale: 1.03 }}
      onClick={handleClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${colorClass}
        border backdrop-blur-xl
        cursor-pointer group
        transition-all duration-500
        hover:shadow-glass-lg
      `}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.03] rounded-bl-full" />

      <motion.div
        className="text-4xl mb-4"
        whileHover={{ scale: 1.2, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>

      <h3 className="text-lg font-semibold text-white dark:text-white mb-1">{domain}</h3>
      <p className="text-sm text-white/40">{jobCount || '120+'} jobs available</p>

      <div className="mt-4 flex items-center gap-2 text-sm text-accent-purple-light font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        Explore →
      </div>
    </motion.div>
  );
}
