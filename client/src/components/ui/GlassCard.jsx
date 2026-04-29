import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  onClick,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={hover ? {
        y: -6,
        transition: { duration: 0.3 }
      } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.06]
        ${hover ? 'cursor-pointer hover:bg-white/[0.07] hover:border-accent-purple/30 hover:shadow-card-hover' : ''}
        transition-all duration-500
        ${padding}
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
