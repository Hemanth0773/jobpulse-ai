import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function StatCard({ icon, label, value, suffix = '', color = 'purple', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value) || 0;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const colorMap = {
    purple: {
      bg: 'from-accent-purple/20 to-accent-purple/5',
      icon: 'text-accent-purple',
      glow: 'shadow-neon-purple',
      border: 'border-accent-purple/20',
    },
    neon: {
      bg: 'from-accent-neon/20 to-accent-neon/5',
      icon: 'text-accent-neon',
      glow: 'shadow-neon-green',
      border: 'border-accent-neon/20',
    },
    pink: {
      bg: 'from-accent-pink/20 to-accent-pink/5',
      icon: 'text-accent-pink',
      glow: 'shadow-neon-pink',
      border: 'border-accent-pink/20',
    },
    yellow: {
      bg: 'from-accent-yellow/20 to-accent-yellow/5',
      icon: 'text-accent-yellow',
      border: 'border-accent-yellow/20',
    },
  };

  const c = colorMap[color] || colorMap.purple;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-2xl p-6
        bg-gradient-to-br ${c.bg}
        border ${c.border}
        backdrop-blur-xl
        transition-shadow duration-500
        hover:${c.glow}
        group cursor-default
      `}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.03] to-transparent rounded-bl-full" />

      <div className={`text-3xl mb-3 ${c.icon} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      <div className="text-3xl font-bold text-white font-display mb-1">
        {count.toLocaleString()}{suffix}
      </div>

      <div className="text-sm text-white/50 font-medium">{label}</div>
    </motion.div>
  );
}
