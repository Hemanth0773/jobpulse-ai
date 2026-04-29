import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FiHome, FiGrid, FiBriefcase, FiFileText, FiUser,
  FiMessageCircle, FiSettings, FiChevronLeft, FiChevronRight,
  FiBarChart2, FiHeart
} from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const menuItems = [
  { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { path: '/jobs', icon: FiBriefcase, label: 'Jobs' },
  { path: '/resume', icon: FiFileText, label: 'Resume AI' },
  { path: '/profile', icon: FiUser, label: 'Profile' },
  { path: '/chatbot', icon: FiMessageCircle, label: 'AI Chat' },
];

const bottomItems = [
  { path: '/bookmarks', icon: FiHeart, label: 'Saved' },
  { path: '/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        fixed left-0 top-20 bottom-0 z-40
        ${collapsed ? 'w-20' : 'w-64'}
        ${isDark
          ? 'bg-navy-900/50 backdrop-blur-xl border-r border-white/[0.06]'
          : 'bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-lg shadow-gray-200/40'
        }
        transition-all duration-300
        flex flex-col
        hidden lg:flex
      `}
    >
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`
          absolute -right-3 top-6 w-6 h-6 rounded-full
          flex items-center justify-center z-50
          transition-all
          ${isDark
            ? 'bg-navy-700 border border-white/[0.1] text-white/50 hover:text-white hover:bg-navy-600'
            : 'bg-white border border-gray-300 text-gray-500 hover:text-gray-800 hover:bg-gray-100 shadow-md'
          }
        `}
      >
        {collapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
      </button>

      {/* Main Nav */}
      <div className={`flex-1 px-3 py-6 space-y-1`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-300 group
                ${isActive
                  ? isDark ? 'text-white' : 'text-gray-900'
                  : isDark
                    ? 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className={`absolute inset-0 rounded-xl border-l-2 border-accent-purple ${isDark ? 'bg-gradient-to-r from-accent-purple/15 to-transparent' : 'bg-blue-50'}`}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={20} className={`relative z-10 flex-shrink-0 ${isActive ? 'text-accent-purple' : 'group-hover:text-accent-purple-light'} transition-colors`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Nav */}
      <div className={`px-3 py-4 space-y-1 border-t ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-300 group
                ${isActive
                  ? isDark ? 'text-white bg-white/[0.06]' : 'text-gray-900 bg-blue-50'
                  : isDark
                    ? 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }
              `}
            >
              <Icon size={20} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </div>
    </motion.aside>
  );
}
