import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiMapPin, FiEdit3, FiSave, FiFileText, FiBookmark, FiExternalLink } from 'react-icons/fi';
import Sidebar from '../components/layout/Sidebar';
import GlassCard from '../components/ui/GlassCard';
import AnimatedSection from '../components/animations/AnimatedSection';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getUserProfile, updateUserProfile, getUserBookmarks } from '../services/firestore';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'Loading...',
    email: user?.email || '',
    location: user?.location || '',
    role: user?.role === 'employer' ? 'Employer' : 'Job Seeker',
    bio: user?.bio || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      fetchProfileData();
    }
  }, [user?.uid]);

  const fetchProfileData = async () => {
    try {
      const data = await getUserProfile(user.uid);
      if (data) {
        setProfile(p => ({
          ...p,
          name: data.name || '',
          email: data.email || '',
          location: data.location || '',
          bio: data.bio || '',
          skills: data.skills || [],
        }));
        if (data.resumeUrl) {
          setResumeData({ fileUrl: data.resumeUrl, fileName: 'Resume' });
        }
      }
      // Fetch bookmarked jobs
      const bookmarks = await getUserBookmarks(user.uid);
      setSavedJobs(bookmarks);
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(p => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  };

  const handleSave = async () => {
    if (!editing) return setEditing(true);

    try {
      await updateUserProfile(user.uid, {
        name: profile.name,
        bio: profile.bio,
        location: profile.location,
        skills: profile.skills,
      });
      await refreshUser();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container pt-20 min-h-screen">
      <Sidebar />
      <main className="lg:pl-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {/* Cover + Avatar */}
          <AnimatedSection>
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <div className="h-48 bg-gradient-to-r from-accent-purple/30 via-accent-pink/20 to-accent-neon/10" />
              <div className="absolute -bottom-12 left-8 flex items-end gap-5">
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-5xl font-bold border-4 border-navy-900 shadow-xl overflow-hidden">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    profile.name.charAt(0)
                  )}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={handleSave}
                className="absolute top-4 right-4 px-4 py-2 rounded-xl bg-white/10 backdrop-blur text-white text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                {editing ? <><FiSave size={14} /> Save</> : <><FiEdit3 size={14} /> Edit</>}
              </motion.button>
            </div>
          </AnimatedSection>

          <div className="mt-16 space-y-6">
            {/* Profile Info */}
            <GlassCard hover={false}>
              <div className="space-y-4">
                <div>
                  {editing ? (
                    <input
                      value={profile.name}
                      onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="input-glass text-xl font-bold"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white font-display">{profile.name}</h2>
                  )}
                  <p className="text-accent-purple-light font-medium mt-1">{profile.role}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1.5"><FiMail size={14} /> {profile.email}</span>
                  <span className="flex items-center gap-1.5"><FiMapPin size={14} /> {profile.location || 'Not set'}</span>
                </div>

                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    className="input-glass min-h-[80px] resize-none"
                  />
                ) : (
                  <p className="text-white/60 leading-relaxed">{profile.bio || 'No bio yet.'}</p>
                )}
              </div>
            </GlassCard>

            {/* Skills */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map(skill => (
                  <motion.span
                    key={skill}
                    layout
                    className="tag group"
                  >
                    {skill}
                    {editing && (
                      <button onClick={() => removeSkill(skill)} className="ml-2 text-accent-pink opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    )}
                  </motion.span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2">
                  <input
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="input-glass text-sm flex-1"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={addSkill}
                    className="btn-glow text-sm px-4"
                  >
                    Add
                  </motion.button>
                </div>
              )}
            </GlassCard>

            {/* Saved Jobs */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiBookmark className="text-accent-pink" /> Bookmarked Jobs
              </h3>
              <div className="space-y-3">
                {savedJobs.length === 0 ? (
                  <p className="text-sm text-white/40">No saved jobs yet.</p>
                ) : (
                  savedJobs.map((job, i) => (
                    <motion.div
                      key={job._id || job.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors group"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-white">{job.title}</h4>
                        <p className="text-xs text-white/40">{job.company} • ₹{job.salary?.min || 0} - {job.salary?.max || 0} LPA</p>
                      </div>
                      <Link to={`/jobs/${job._id || job.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 rounded-lg text-white/30 group-hover:text-accent-purple transition-colors"
                        >
                          <FiExternalLink size={16} />
                        </motion.button>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Resume */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiFileText className="text-accent-neon" /> Resume
              </h3>
              {resumeData ? (
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                      <FiFileText className="text-accent-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{resumeData.fileName}</p>
                      <p className="text-xs text-white/40">Uploaded to Firebase Storage</p>
                    </div>
                  </div>
                  <a href={resumeData.fileUrl} target="_blank" rel="noreferrer">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="btn-outline-glow text-sm px-4 py-2"
                    >
                      Download
                    </motion.button>
                  </a>
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-sm text-white/40 mb-3">No resume uploaded yet.</p>
                  <Link to="/resume" className="btn-outline-glow text-sm px-4 py-2 inline-block">
                    Upload Resume
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
}
