import { useState, useEffect, createContext, useContext } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import { getUserProfile, createUserProfile, seedJobs } from '../services/firestore.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes (handles persistence automatically)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in — fetch their Firestore profile
        try {
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            // First-time user (e.g. Google sign-in) — create Firestore profile
            await createUserProfile(firebaseUser.uid, {
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || '',
            });
            profile = await getUserProfile(firebaseUser.uid);
          }
          setUser({
            ...profile,
            uid: firebaseUser.uid,
            _id: firebaseUser.uid,
            photoURL: firebaseUser.photoURL || profile.avatar || '',
          });
        } catch (err) {
          console.error('Error fetching user profile:', err);
          // Set basic info from Firebase Auth even if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            _id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'jobseeker',
            skills: [],
            bookmarkedJobs: [],
          });
        }
        // Seed jobs in the background on first login
        seedJobs().catch(() => {});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email/password login
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error.code) };
    }
  };

  // Email/password register
  const register = async (name, email, password, role = 'jobseeker') => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name on Firebase Auth profile
      await updateProfile(cred.user, { displayName: name });
      // Create Firestore user document
      await createUserProfile(cred.user.uid, { name, email, role });
      // Seed jobs for new users
      seedJobs().catch(() => {});
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error.code) };
    }
  };

  // Google sign-in
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      return { success: false, message: getErrorMessage(error.code) };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Refresh user data from Firestore
  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const profile = await getUserProfile(auth.currentUser.uid);
    if (profile) {
      setUser(prev => ({
        ...prev,
        ...profile,
        uid: auth.currentUser.uid,
        _id: auth.currentUser.uid,
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      setUser,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function getErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return messages[code] || 'An error occurred. Please try again.';
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
