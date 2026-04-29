import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiHome, FiGrid } from 'react-icons/fi';

export default function JobApplySuccess() {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const colors = ['#8B5CF6', '#F472B6', '#39FF14', '#FBBF24', '#22D3EE'];
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }));
    setConfetti(particles);
  }, []);

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Confetti */}
      {confetti.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: 360 * (Math.random() > 0.5 ? 1 : -1) }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
          style={{
            position: 'fixed',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            zIndex: 100,
          }}
        />
      ))}

      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-purple w-[400px] h-[400px] top-20 left-1/4 opacity-20" />
        <div className="orb orb-neon w-[300px] h-[300px] bottom-20 right-1/4 opacity-15" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center max-w-md"
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-accent-neon/20 to-accent-cyan/10 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            <FiCheckCircle size={48} className="text-accent-neon" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-3xl sm:text-4xl font-bold font-display text-white mb-4"
        >
          Application <span className="gradient-text-neon">Submitted!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/50 mb-8 leading-relaxed"
        >
          Your application has been sent successfully. We'll notify you when the recruiter reviews it. Good luck! 🚀
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass-card p-5 mb-8 text-left"
        >
          <h3 className="text-sm text-white/50 mb-3">Applied to</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-yellow to-accent-pink flex items-center justify-center text-white font-bold text-lg">
              G
            </div>
            <div>
              <h4 className="text-white font-semibold">Senior React Developer</h4>
              <p className="text-sm text-white/40">Google • Remote • 18-32 LPA</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/jobs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-glow flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Browse More Jobs <FiArrowRight size={16} />
            </motion.button>
          </Link>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline-glow flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              <FiGrid size={16} /> Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
