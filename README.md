# 🚀 JobPulseAI — AI-Powered Job Portal

A full-stack, serverless AI-powered job portal with a premium cyber-futuristic UI, powered by **Firebase** and built with modern web technologies.

![Firebase](https://img.shields.io/badge/Firebase-Serverless-FFCA28?style=flat-square&logo=firebase)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🔗 Live Demo

🌐 **GitHub:** [github.com/Hemanth0773/jobpulse-ai](https://github.com/Hemanth0773/jobpulse-ai)

---

## ✨ Features

### 🎨 Premium Dark Theme UI
- Glassmorphism cards with backdrop blur effects
- Neon purple / green / pink accent color palette
- Smooth Framer Motion page transitions & micro-animations
- Fully responsive design (mobile, tablet, desktop)
- Dark / Light mode toggle with localStorage persistence

### 🔥 Firebase Integration (Serverless)
- **Firebase Authentication** — Email/Password + Google OAuth sign-in
- **Cloud Firestore** — Real-time NoSQL database for jobs, users, and applications
- **Firebase Storage** — Resume file uploads with secure download URLs
- **Auto-seeding** — 15 curated jobs from top companies seeded on first login
- **No backend server required** — runs entirely client-side via Firebase SDKs

### 🤖 AI-Powered Features
- **Resume Analyzer** — ATS score calculation, skill extraction, salary prediction, improvement suggestions
- **Smart Job Finder** — AI-matched job recommendations based on resume analysis
- **AI Chatbot (PulseBot)** — Career guidance, interview prep, personalized suggestions
- **Team Builder** — AI-suggested team compositions for projects and hackathons

### 📱 Pages & Functionality
| # | Page | Description |
|---|------|-------------|
| 1 | **Landing** | Hero section, animated stats, domain cards, featured jobs, CTA |
| 2 | **Login** | Firebase Auth — Google OAuth + Email/Password + CAPTCHA |
| 3 | **Signup** | Role selector (Job Seeker / Employer) + Google sign-up |
| 4 | **Dashboard** | Personalized stats, ATS score, recommended jobs, activity feed |
| 5 | **Profile** | Editable bio/skills, bookmarked jobs, resume download |
| 6 | **Resume AI** | Drag & drop upload → Firebase Storage → AI analysis results |
| 7 | **Job Listings** | Search, domain/type filters, 15 seeded jobs from Firestore |
| 8 | **Job Details** | Full description, requirements, responsibilities, salary, apply button |
| 9 | **Apply Success** | Animated confirmation page with confetti |
| 10 | **AI Chatbot** | Full-page chat with multiple modes (Career, Interview, Resume) |

### 🔐 Authentication & Security
- Protected routes — Dashboard, Profile, Resume require login
- Firebase Auth state persistence (survives browser refresh)
- Firestore security rules — users can only edit their own data
- CAPTCHA verification on login and signup forms

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 3 |
| Animations | Framer Motion |
| Auth | Firebase Authentication (Email/Password + Google) |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Icons | React Icons (Feather Icons) |
| Routing | React Router v7 |
| State | React Context API |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **A Firebase project** ([create one here](https://console.firebase.google.com))

> **No MongoDB, no backend server, no local database required!**

### 1. Clone & Install

```bash
git clone https://github.com/Hemanth0773/jobpulse-ai.git
cd jobpulse-ai/client
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create a new project
2. **Authentication** → Enable **Email/Password** and **Google** providers
3. **Firestore Database** → Create database in **test mode**
4. **Storage** → Enable in **test mode**
5. **Project Settings** → Register a **Web app** → Copy the config

### 3. Configure Environment

Create `client/.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Run

```bash
cd client
npm run dev
```

Visit **http://localhost:5173** 🎉

> 💡 **That's it!** No backend server to start. Jobs are auto-seeded to Firestore on your first login.

---

## 📁 Project Structure

```
jobpulse-ai/
├── client/                          # React Frontend (Vite)
│   ├── public/                      # Static assets, favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── animations/          # AnimatedSection, StaggerContainer
│   │   │   ├── cards/               # JobCard, StatCard, DomainCard
│   │   │   ├── chat/                # ChatWidget (PulseBot)
│   │   │   ├── layout/              # Navbar, Sidebar, Footer
│   │   │   └── ui/                  # GlassCard, CircularProgress, SkeletonLoader
│   │   ├── config/
│   │   │   └── firebase.js          # 🔥 Firebase SDK initialization
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Firebase Auth state management
│   │   │   └── ThemeContext.jsx      # Dark/Light mode toggle
│   │   ├── pages/                   # 10 pages (Landing → Chatbot)
│   │   ├── services/
│   │   │   ├── firestore.js         # 🔥 Firestore CRUD + job seeding
│   │   │   └── storage.js           # 🔥 Firebase Storage upload
│   │   ├── App.jsx                  # Routes + ProtectedRoute wrapper
│   │   └── index.css                # Tailwind + custom design tokens
│   ├── .env                         # Firebase config (git-ignored)
│   ├── tailwind.config.js           # Custom theme tokens
│   └── vite.config.js
│
├── server/                          # Legacy Express backend (not required)
├── .gitignore
└── README.md
```

---

## 🗄️ Firestore Data Model

```
📦 Firestore
├── 📁 users/{uid}
│   ├── name, email, role, bio, location
│   ├── skills[], bookmarkedJobs[]
│   ├── resumeUrl, avatar
│   └── createdAt, updatedAt
│
├── 📁 jobs/{jobId}
│   ├── title, company, description
│   ├── requirements[], responsibilities[]
│   ├── salary: { min, max }
│   ├── location, type, domain, tags[]
│   └── createdAt, updatedAt
│
└── 📁 applications/{appId}
    ├── userId, jobId, status
    └── appliedAt
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background (Dark) | `#050816` / `#0B0F19` |
| Background (Light) | `#F5F7FB` |
| Accent Purple | `#8B5CF6` |
| Neon Green | `#39FF14` |
| Accent Pink | `#F472B6` |
| Accent Yellow | `#FBBF24` |
| Accent Cyan | `#22D3EE` |
| Fonts | Inter, Poppins |
| Border Radius | 16px (cards), 12px (buttons) |
| Glass Effect | 5% white + 20px backdrop blur |

---

## 🔒 Firebase Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /applications/{appId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🧑‍💻 Author

Built with ❤️ by **Hemanth** — [@Hemanth0773](https://github.com/Hemanth0773)

## 📜 License

MIT License — free to use, modify, and distribute.
