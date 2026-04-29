import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaA = useRef(Math.floor(Math.random() * 10) + 1).current;
  const captchaB = useRef(Math.floor(Math.random() * 10) + 1).current;
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (parseInt(captchaAnswer) !== captchaA + captchaB) {
      setError('Incorrect CAPTCHA answer');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed. Check credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4 py-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-purple w-[400px] h-[400px] top-20 -left-32 opacity-20" />
        <div className="orb orb-pink w-[300px] h-[300px] bottom-20 right-10 opacity-15" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold font-display text-white">
                JobPulse<span className="text-accent-neon">AI</span>
              </span>
            </Link>
            <h1 className={`text-2xl font-bold font-display mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome Back</h1>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-500'}`}>Sign in to continue your journey</p>
          </div>

          {/* Google OAuth */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 p-3.5 rounded-xl font-medium text-sm transition-all mb-6 disabled:opacity-50 ${
              isDark 
                ? 'bg-white/[0.06] border border-white/[0.08] text-white/80 hover:bg-white/[0.1]' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-4 mb-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.06]' : 'bg-gray-200'}`} />
            <span className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>or sign in with email</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-white/[0.06]' : 'bg-gray-200'}`} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className={`text-sm mb-1.5 block ${isDark ? 'text-white/50' : 'text-gray-600'}`}>Email</label>
              <div className="relative">
                <FiMail className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-glass pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`text-sm mb-1.5 block ${isDark ? 'text-white/50' : 'text-gray-600'}`}>Password</label>
              <div className="relative">
                <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-gray-400'}`} size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-glass pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}
            <div>
              <label className={`text-sm mb-1.5 block ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                What is {captchaA} + {captchaB}?
              </label>
              <input
                type="number"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="Your answer"
                className="input-glass"
                required
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-glow w-full py-4 flex items-center justify-center gap-2 text-base disabled:opacity-50"
              style={{ color: '#fff' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <FiArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-purple-light hover:text-accent-purple transition-colors font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
