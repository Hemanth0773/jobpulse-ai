import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiUser, FiArrowLeft, FiZap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const modes = [
  { id: 'career', label: '💡 Career Advice', desc: 'Get personalized career guidance' },
  { id: 'jobs', label: '🔍 Job Finder', desc: 'Find jobs matching your profile' },
  { id: 'team', label: '👥 Team Builder', desc: 'Build your dream team' },
  { id: 'interview', label: '🎯 Interview Prep', desc: 'Practice for interviews' },
];


export default function ChatbotPage() {
  const [selectedMode, setSelectedMode] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hey! 👋 I'm **PulseBot**, your AI career assistant. Choose a mode below or just ask me anything!" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('chat:response', (data) => {
      setMessages(prev => [...prev, { role: 'ai', content: data.content }]);
    });

    socketRef.current.on('chat:typing', (isTyping) => {
      setTyping(isTyping);
    });

    socketRef.current.on('chat:error', (error) => {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now. 😔" }]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectMode = (mode) => {
    setSelectedMode(mode.id);
    setMessages(prev => [...prev, { role: 'user', content: mode.label }]);
    if (socketRef.current) {
      socketRef.current.emit('chat:message', { message: `I selected ${mode.label}. What can you help me with?`, mode: mode.id });
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    
    if (socketRef.current) {
      socketRef.current.emit('chat:message', { message: msg, mode: selectedMode || 'general' });
    }
  };

  return (
    <div className="page-container pt-20 min-h-screen flex">
      <Sidebar />
      <main className="lg:pl-64 flex-1 transition-all duration-300 flex flex-col max-h-screen pt-20 fixed inset-0">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] bg-navy-900/50 backdrop-blur-xl flex items-center gap-4 lg:pl-70">
          <Link to="/dashboard" className="lg:hidden p-2 rounded-lg hover:bg-white/[0.05]">
            <FiArrowLeft size={20} className="text-white/60" />
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
            <FiCpu size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold">PulseBot AI</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-neon animate-pulse" />
              <span className="text-xs text-white/40">Online • Powered by AI</span>
            </div>
          </div>
          <div className="ml-auto">
            <span className="tag flex items-center gap-1">
              <FiZap size={12} /> {selectedMode || 'General'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 lg:pl-70">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === 'ai'
                  ? 'bg-gradient-to-br from-accent-purple/20 to-accent-pink/10'
                  : 'bg-gradient-to-br from-accent-cyan/20 to-accent-blue/10'
              }`}>
                {msg.role === 'ai' ? <FiCpu size={16} className="text-accent-purple" /> : <FiUser size={16} className="text-accent-cyan" />}
              </div>
              <div className={`
                max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-line
                ${msg.role === 'user'
                  ? 'bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white rounded-br-md'
                  : 'bg-white/[0.05] text-white/80 rounded-bl-md border border-white/[0.06]'
                }
              `}>
                {msg.content.split('**').map((part, j) =>
                  j % 2 === 0 ? part : <strong key={j} className="text-white font-semibold">{part}</strong>
                )}
              </div>
            </motion.div>
          ))}

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-pink/10 flex items-center justify-center">
                <FiCpu size={16} className="text-accent-purple" />
              </div>
              <div className="bg-white/[0.05] rounded-2xl rounded-bl-md px-5 py-4 flex gap-1.5 border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mode Selection */}
        {!selectedMode && messages.length <= 1 && (
          <div className="px-6 pb-2 lg:pl-70">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl">
              {modes.map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectMode(mode)}
                  className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-accent-purple/30 hover:bg-white/[0.06] transition-all text-left"
                >
                  <div className="text-xl mb-2">{mode.label.split(' ')[0]}</div>
                  <p className="text-xs text-white/40">{mode.desc}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/[0.06] bg-navy-900/50 backdrop-blur-xl lg:pl-70">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="max-w-3xl flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your career..."
              className="input-glass flex-1 py-3.5"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-purple-dark text-white hover:shadow-neon-purple transition-shadow"
            >
              <FiSend size={18} />
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
}
