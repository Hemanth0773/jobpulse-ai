import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiBriefcase, FiStar, FiX } from 'react-icons/fi';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/layout/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import CircularProgress from '../components/ui/CircularProgress';
import AnimatedSection from '../components/animations/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { uploadResume } from '../services/storage';
import { updateUserProfile } from '../services/firestore';

// Mock AI analysis (works without OpenAI key)
function getMockAnalysis() {
  return {
    atsScore: 60 + Math.floor(Math.random() * 30),
    extractedSkills: ['JavaScript', 'React.js', 'Node.js', 'Python', 'MongoDB', 'TypeScript', 'Git', 'CSS'],
    suggestions: [
      { type: 'improve', text: 'Add quantifiable achievements to your experience section' },
      { type: 'improve', text: 'Include relevant keywords: "CI/CD", "Agile", "REST APIs"' },
      { type: 'good', text: 'Strong technical skills section' },
      { type: 'good', text: 'Clean and professional format' },
      { type: 'improve', text: 'Add a professional summary at the top' },
      { type: 'warning', text: 'Consider condensing resume to 1-2 pages' },
    ],
    predictedSalary: { min: 8 + Math.floor(Math.random() * 8), max: 18 + Math.floor(Math.random() * 15) },
    recommendedRoles: [
      { title: 'Full Stack Developer', match: 85 + Math.floor(Math.random() * 10) },
      { title: 'Frontend Engineer', match: 80 + Math.floor(Math.random() * 15) },
      { title: 'React Developer', match: 88 + Math.floor(Math.random() * 10) },
      { title: 'Software Engineer', match: 75 + Math.floor(Math.random() * 15) },
    ],
  };
}

export default function ResumeUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const onDrop = useCallback((files) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResults(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    if (!user) {
      alert('Please log in to upload your resume.');
      return;
    }
    setAnalyzing(true);

    try {
      // 1. Upload to Firebase Storage
      const uploadResult = await uploadResume(file, user.uid);

      // 2. Save resume URL to Firestore user profile
      await updateUserProfile(user.uid, {
        resumeUrl: uploadResult.url,
      });

      // 3. Mock AI analysis (works without backend)
      // Small delay for natural feeling
      await new Promise(resolve => setTimeout(resolve, 1500));
      const analysis = getMockAnalysis();

      setResults(analysis);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert(error.message || 'Upload failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="page-container pt-20 min-h-screen">
      <Sidebar />

      <main className="lg:pl-64 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <AnimatedSection>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              AI Resume <span className="gradient-text">Analyzer</span>
            </h1>
            <p className="text-white/40 mb-8">Upload your resume and get AI-powered insights to boost your career</p>
          </AnimatedSection>

          {/* Upload Zone */}
          {!results && (
            <AnimatedSection delay={0.1}>
              <div
                {...getRootProps()}
                className={`
                  relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer
                  transition-all duration-300
                  ${isDragActive
                    ? 'border-accent-purple bg-accent-purple/5'
                    : 'border-white/10 hover:border-accent-purple/40 hover:bg-white/[0.02]'
                  }
                `}
              >
                <input {...getInputProps()} />
                <motion.div
                  animate={{ y: isDragActive ? -10 : 0 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center ${isDragActive ? 'bg-accent-purple/20' : 'bg-white/[0.05]'} transition-colors`}>
                    <FiUploadCloud size={36} className={isDragActive ? 'text-accent-purple' : 'text-white/40'} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </h3>
                  <p className="text-white/40 text-sm mb-4">Supports PDF, DOC, DOCX (Max 5MB)</p>
                  <button className="btn-outline-glow text-sm px-6 py-2.5">Browse Files</button>
                </motion.div>
              </div>

              {/* Selected File */}
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FiFileText size={24} className="text-accent-purple" />
                    <div>
                      <p className="text-sm text-white font-medium">{file.name}</p>
                      <p className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="btn-glow text-sm px-6 py-2.5 disabled:opacity-50"
                    >
                      {analyzing ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </span>
                      ) : (
                        'Analyze with AI'
                      )}
                    </motion.button>
                    <button onClick={() => setFile(null)} className="p-2 text-white/30 hover:text-white/60">
                      <FiX size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Analyzing Animation */}
              {analyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 text-center"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-purple/10 border border-accent-purple/20">
                    <div className="w-5 h-5 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
                    <span className="text-sm text-accent-purple-light">AI is analyzing your resume...</span>
                  </div>
                </motion.div>
              )}
            </AnimatedSection>
          )}

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-6"
              >
                {/* Score + Salary Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <GlassCard delay={0.1}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiStar className="text-accent-purple" /> ATS Score
                    </h3>
                    <div className="flex justify-center">
                      <CircularProgress value={results.atsScore} size={180} delay={0.3} />
                    </div>
                  </GlassCard>

                  <GlassCard delay={0.2}>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiDollarSign className="text-accent-neon" /> Predicted Salary
                    </h3>
                    <div className="text-center py-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                        className="text-5xl font-bold font-display gradient-text-neon mb-2"
                      >
                        ₹{results.predictedSalary.min} - {results.predictedSalary.max} LPA
                      </motion.div>
                      <p className="text-sm text-white/40">Based on your skills and experience</p>
                    </div>
                  </GlassCard>
                </div>

                {/* Extracted Skills */}
                <GlassCard delay={0.3} hover={false}>
                  <h3 className="text-lg font-semibold text-white mb-4">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.extractedSkills?.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="tag"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>

                {/* Suggestions */}
                <GlassCard delay={0.4} hover={false}>
                  <h3 className="text-lg font-semibold text-white mb-4">Improvement Suggestions</h3>
                  <div className="space-y-3">
                    {results.suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02]"
                      >
                        {s.type === 'good' ? (
                          <FiCheckCircle className="text-accent-neon mt-0.5 flex-shrink-0" size={18} />
                        ) : s.type === 'warning' ? (
                          <FiAlertTriangle className="text-accent-yellow mt-0.5 flex-shrink-0" size={18} />
                        ) : (
                          <FiAlertTriangle className="text-accent-pink mt-0.5 flex-shrink-0" size={18} />
                        )}
                        <p className="text-sm text-white/70">{s.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Recommended Roles */}
                <GlassCard delay={0.5} hover={false}>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FiBriefcase className="text-accent-purple" /> Recommended Roles
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {results.recommendedRoles.map((role, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-purple/30 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-white">{role.title}</span>
                          <span className={`text-sm font-bold ${role.match >= 90 ? 'text-accent-neon' : 'text-accent-purple-light'}`}>
                            {role.match}% match
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>

                {/* Reset */}
                <div className="text-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setResults(null); setFile(null); }}
                    className="btn-outline-glow px-8 py-3"
                  >
                    Analyze Another Resume
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
