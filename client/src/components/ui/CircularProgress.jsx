import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function CircularProgress({ value = 75, size = 160, strokeWidth = 10, delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(start);
        }
      }, 20);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const getColor = () => {
    if (displayValue >= 80) return { stroke: '#39FF14', text: 'text-accent-neon', label: 'Excellent' };
    if (displayValue >= 60) return { stroke: '#8B5CF6', text: 'text-accent-purple', label: 'Good' };
    if (displayValue >= 40) return { stroke: '#FBBF24', text: 'text-accent-yellow', label: 'Average' };
    return { stroke: '#F472B6', text: 'text-accent-pink', label: 'Needs Work' };
  };

  const colorInfo = getColor();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className="relative inline-flex items-center justify-center"
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorInfo.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
            filter: `drop-shadow(0 0 8px ${colorInfo.stroke}40)`,
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={`text-3xl font-bold font-display ${colorInfo.text}`}>
          {displayValue}
        </div>
        <div className="text-xs text-white/40 mt-0.5">{colorInfo.label}</div>
      </div>
    </motion.div>
  );
}
