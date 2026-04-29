import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu, FiUser } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const quickActions = [
  '🔍 Find jobs for me',
  '📄 Analyze my resume',
  '👥 Build a team',
  '💡 Career advice',
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey! 👋 I'm PulseBot, your AI career assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');

    // Mock AI response
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const responses = [
        "I can help you with that! Let me look into some options for you. 🔍",
        "Great question! Based on current trends, I'd recommend focusing on skills like React, Python, and cloud computing. 📈",
        "I'd suggest tailoring your resume to highlight specific achievements. Would you like tips on that? 💡",
        "There are several exciting opportunities in your field right now. Let me find the best matches! 🎯",
      ];
      setMessages(prev => [...prev, { role: 'ai', content: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 1500);
  };

  return (
    <>
      {/* Float Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-accent-purple to-accent-pink
          text-white shadow-neon-purple
          flex items-center justify-center
          transition-all duration-300
          ${isOpen ? 'rotate-90' : 'animate-bounce-soft'}
        `}
        style={{ color: '#fff' }}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`
              fixed bottom-24 right-6 z-50 w-[380px] max-h-[520px] rounded-2xl overflow-hidden
              backdrop-blur-xl flex flex-col
              ${isDark
                ? 'bg-navy-900/95 border border-white/[0.08] shadow-glass-lg'
                : 'bg-white border border-gray-200 shadow-xl shadow-gray-300/30'
              }
            `}
          >
            {/* Header */}
            <div className={`
              p-4 border-b bg-gradient-to-r from-accent-purple/10 to-accent-pink/5
              ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}
            `}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
                  <FiCpu size={18} className="text-white" style={{ color: '#fff' }} />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>PulseBot AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCpu size={14} className="text-accent-purple" />
                    </div>
                  )}
                  <div className={`
                    max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white rounded-br-md'
                      : isDark
                        ? 'bg-white/[0.06] text-white/80 rounded-bl-md'
                        : 'bg-gray-100 text-gray-700 rounded-bl-md'
                    }
                  `}
                  style={msg.role === 'user' ? { color: '#fff' } : {}}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-accent-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiUser size={14} className="text-accent-pink" />
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                    <FiCpu size={14} className="text-accent-purple" />
                  </div>
                  <div className={`rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 ${isDark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}>
                    <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} style={{ animationDelay: '0ms' }} />
                    <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} style={{ animationDelay: '150ms' }} />
                    <span className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-white/30' : 'bg-gray-400'}`} style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage(action)}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs transition-all
                      ${isDark
                        ? 'bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white hover:border-accent-purple/30'
                        : 'bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-accent-purple/30'
                      }
                    `}
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={`p-3 border-t ${isDark ? 'border-white/[0.06]' : 'border-gray-200'}`}>
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="input-glass text-sm flex-1 py-3"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white hover:shadow-neon-purple transition-shadow"
                  style={{ color: '#fff' }}
                >
                  <FiSend size={16} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
