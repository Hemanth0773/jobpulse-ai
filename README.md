# 🚀 JobPulseAI — AI-Powered Job Portal

A full-stack, LinkedIn-style AI-powered job portal with a premium dark theme UI, built with modern web technologies.

![Dark Theme](https://img.shields.io/badge/Theme-Dark-0B0F19?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

## ✨ Features

### 🎨 Premium Dark Theme UI
- Glassmorphism cards with backdrop blur
- Neon purple / green / pink accent colors
- Smooth Framer Motion animations
- Responsive design (mobile, tablet, desktop)

### 🤖 AI Features
- **Resume Analyzer** — ATS score, skill extraction, salary prediction
- **Smart Job Finder** — AI-matched job recommendations
- **AI Chatbot (PulseBot)** — Career guidance, interview prep
- **Team Builder** — AI-suggested team compositions

### 📱 8 Complete Pages
1. Landing Page (hero, stats, domains, featured jobs, CTA)
2. Login (Google OAuth + CAPTCHA)
3. Signup (role selector)
4. Dashboard (ATS score, skills, recommendations)
5. Profile (editable, skills, bookmarks)
6. Resume AI (drag & drop upload + analysis)
7. Job Listings (search, filter, pagination)
8. AI Chatbot (full-page, multiple modes)

### 💼 Backend API
- JWT Authentication + Google OAuth
- Job CRUD + search/filter
- Resume upload + AI analysis
- Real-time chat (Socket.io)
- Notification system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 3 |
| Animations | Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + Google OAuth |
| Real-time | Socket.io |
| AI | OpenAI API (optional) |
| Upload | Multer (local) / AWS S3 (optional) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### 2. Configure Environment

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=sk-xxx  # Optional — works without it
```

### 3. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** 🎉

---

## 📁 Project Structure

```
Job Board/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── animations/    # AnimatedSection
│   │   │   ├── cards/         # JobCard, StatCard, DomainCard
│   │   │   ├── chat/          # ChatWidget
│   │   │   ├── layout/        # Navbar, Sidebar, Footer
│   │   │   └── ui/            # GlassCard, CircularProgress, SkeletonLoader
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # 8 pages
│   │   ├── App.jsx
│   │   └── index.css
│   └── tailwind.config.js
│
├── server/                    # Express Backend
│   ├── config/                # DB connection
│   ├── middleware/            # Auth, Upload
│   ├── models/                # User, Job, Resume
│   ├── routes/                # Auth, Jobs, Users, Resume, Chat
│   ├── services/              # AI service
│   ├── socket/                # WebSocket handlers
│   └── server.js
│
└── README.md
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#050816` / `#0B0F19` |
| Purple | `#8B5CF6` |
| Neon Green | `#39FF14` |
| Pink | `#F472B6` |
| Yellow | `#FBBF24` |
| Cyan | `#22D3EE` |
| Font | Inter, Poppins |
| Border Radius | 16px (cards) |
| Glass | 5% white + 20px blur |

---

## 📜 License

MIT — Built with ❤️ by JobPulseAI
