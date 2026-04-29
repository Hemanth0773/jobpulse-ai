// AI Service — Uses OpenAI if API key is available, otherwise smart mock responses

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export async function analyzeResume(resume) {
  if (OPENAI_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: OPENAI_KEY });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: 'You are an expert resume analyzer. Analyze the resume and return JSON with: atsScore (0-100), extractedSkills (array), suggestions (array of {type: "good"|"improve"|"warning", text}), predictedSalary ({min, max} in LPA), recommendedRoles (array of {title, match percentage}).'
        }, {
          role: 'user',
          content: `Analyze this resume: ${resume.fileName}. File URL: ${resume.fileUrl}`
        }],
        temperature: 0.7,
      });

      const text = response.choices[0].message.content;
      try {
        return JSON.parse(text);
      } catch {
        return getMockAnalysis();
      }
    } catch (error) {
      console.error('OpenAI error, falling back to mock:', error.message);
      return getMockAnalysis();
    }
  }

  return getMockAnalysis();
}

export async function getChatResponse(message, mode = 'general') {
  if (OPENAI_KEY) {
    try {
      const { default: OpenAI } = await import('openai');
      const openai = new OpenAI({ apiKey: OPENAI_KEY });

      const systemPrompts = {
        career: 'You are a career advisor. Provide actionable career guidance.',
        jobs: 'You are a job finder AI. Help users find relevant jobs based on their skills.',
        team: 'You are a team building advisor. Suggest ideal team compositions.',
        interview: 'You are an interview coach. Help with interview preparation.',
        general: 'You are PulseBot, an AI career assistant. Help with jobs, resumes, and career advice.',
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompts[mode] || systemPrompts.general },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI chat error:', error.message);
    }
  }

  return getMockChatResponse(message, mode);
}

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

function getMockChatResponse(message, mode) {
  const lower = message.toLowerCase();

  const responses = {
    career: "Based on current market trends, I'd recommend focusing on cloud technologies, AI/ML fundamentals, and system design. These are the highest-growth areas for 2026. Would you like a detailed learning roadmap?",
    jobs: "I found great matches! Based on your profile, I'd suggest: 1) Senior React Developer at Google (95% match), 2) Full Stack Engineer at Stripe (88% match), 3) UI Engineer at Vercel (85% match). Shall I help you apply?",
    team: "For your project, I'd recommend: 1x Full Stack Dev (React + Node.js), 1x UI/UX Designer, 1x DevOps Engineer, and 1x AI/ML specialist if needed. Want me to find candidates?",
    interview: "Let's practice! Here's a common question: 'Design a scalable notification system.' Key points: message queue, push vs pull, delivery guarantees, and scaling strategies. Shall I walk through it?",
  };

  if (responses[mode]) return responses[mode];

  if (lower.includes('job') || lower.includes('find')) {
    return "I can help you find jobs! What domain are you interested in? (Frontend, Backend, AI/ML, Data Science, DevOps, etc.)";
  }
  if (lower.includes('resume') || lower.includes('ats')) {
    return "Upload your resume on the Resume AI page and I'll analyze it for ATS compatibility, skills extraction, and improvement suggestions! 📄";
  }
  if (lower.includes('salary')) {
    return "Based on current market data, typical salaries range from ₹8-15 LPA for entry level, ₹15-30 LPA for mid-level, and ₹30-60+ LPA for senior roles. Your exact range depends on skills, experience, and company.";
  }

  return "That's a great question! I can help you with job searching, resume analysis, team building, and career advice. What would you like to explore? 🤖";
}
