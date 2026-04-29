import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiMoon, FiSun, FiSearch, FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/jobs', label: 'Jobs' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/resume', label: 'Resume AI' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'New job match found!', time: '2m ago' },
    { id: 2, text: 'Your resume score improved', time: '1h ago' },
    { id: 3, text: 'Application viewed by TechCorp', time: '3h ago' },
  ]);
  const [notifOpen, setNotifOpen] = useState(false);

  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotifOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-500
        ${scrolled
          ? isDark
            ? 'bg-navy-900/80 backdrop-blur-xl border-b border-white/[0.06] shadow-glass'
            : 'bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-lg'
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center shadow-neon-purple"
            >
              <span className="text-white font-bold text-lg">J</span>
            </motion.div>
            <span className={`text-xl font-bold font-display transition-colors ${isDark ? 'text-white group-hover:text-accent-purple-light' : 'text-gray-900 group-hover:text-accent-purple'}`}>
              JobPulse<span className="text-accent-neon">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${location.pathname === link.path
                    ? isDark ? 'text-white' : 'text-gray-900'
                    : isDark ? 'text-white/50 hover:text-white hover:bg-white/[0.05]' : 'text-gray-500 hover:text-gray-900 hover:bg-black/[0.05]'
                  }
                `}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all relative overflow-hidden"
            >
              <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ y: -20, rotate: -90, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: 20, rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.div>
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="p-2.5 rounded-xl bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all relative"
              >
                <FiBell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 glass-card p-2 shadow-glass-lg"
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                    </div>
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer">
                        <p className="text-sm text-white/80">{n.text}</p>
                        <p className="text-xs text-white/30 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-white/70 font-medium">{user.name?.split(' ')[0] || 'User'}</span>
                  <FiChevronDown size={14} className={`text-white/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-14 w-56 glass-card p-2 shadow-glass-lg"
                    >
                      <Link to="/profile" className="flex items-center gap-3 p-3 hover:bg-white/[0.05] rounded-xl transition-colors">
                        <FiUser size={16} className="text-white/50" />
                        <span className="text-sm text-white/80">Profile</span>
                      </Link>
                      <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-white/[0.05] rounded-xl transition-colors">
                        <FiSettings size={16} className="text-white/50" />
                        <span className="text-sm text-white/80">Dashboard</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 p-3 hover:bg-white/[0.05] rounded-xl transition-colors w-full text-left"
                      >
                        <FiLogOut size={16} className="text-accent-pink/70" />
                        <span className="text-sm text-accent-pink/70">Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-glow text-sm py-2 px-5"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/[0.05] text-white"
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.06] bg-navy-900/95 backdrop-blur-xl"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-3 text-sm text-white/70 hover:text-white">Sign In</Link>
                    <Link to="/signup" className="block"><button className="btn-glow w-full text-sm">Get Started</button></Link>
                  </>
                ) : (
                  <button onClick={logout} className="flex items-center gap-2 px-4 py-3 text-sm text-accent-pink/70 w-full">
                    <FiLogOut size={16} /> Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
