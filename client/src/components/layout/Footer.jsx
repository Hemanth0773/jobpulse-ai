import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const footerLinks = {
  Product: [
    { label: 'Job Listings', path: '/jobs' },
    { label: 'Resume AI', path: '/resume' },
    { label: 'AI Chatbot', path: '/chatbot' },
    { label: 'Dashboard', path: '/dashboard' },
  ],
  Company: [
    { label: 'About Us', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Blog', path: '#' },
    { label: 'Contact', path: '#' },
  ],
  Support: [
    { label: 'Help Center', path: '#' },
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'FAQ', path: '#' },
  ],
};

const socialLinks = [
  { icon: FiGithub, href: '#', label: 'GitHub' },
  { icon: FiTwitter, href: '#', label: 'Twitter' },
  { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
  { icon: FiMail, href: '#', label: 'Email' },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`
      relative border-t backdrop-blur-xl
      ${isDark
        ? 'border-white/[0.06] bg-navy-950/80'
        : 'border-gray-200 bg-white/80'
      }
    `}>
      {/* Gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                <span className="text-white font-bold text-lg" style={{ color: '#fff' }}>J</span>
              </div>
              <span className={`text-xl font-bold font-display ${isDark ? 'text-white' : 'text-gray-900'}`}>
                JobPulse<span className="text-accent-neon">AI</span>
              </span>
            </Link>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
              Your AI-powered career companion. Find your dream job, optimize your resume, and level up your career with smart insights.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`
                      w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                      ${isDark
                        ? 'bg-white/[0.05] border border-white/[0.06] text-white/40 hover:text-accent-purple hover:border-accent-purple/30'
                        : 'bg-gray-100 border border-gray-200 text-gray-400 hover:text-accent-purple hover:border-accent-purple/30 hover:bg-gray-50'
                      }
                    `}
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={`font-semibold text-sm mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className={`text-sm transition-colors ${isDark ? 'text-white/40 hover:text-accent-purple-light' : 'text-gray-500 hover:text-accent-purple'}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            © 2026 JobPulseAI. All rights reserved.
          </p>
          <p className={`text-sm flex items-center gap-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            Made with <FiHeart className="text-accent-pink" size={14} /> by JobPulseAI Team
          </p>
        </div>
      </div>
    </footer>
  );
}
