import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Gemini AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ reply: 'Please provide a valid message.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in .env');
      return res.status(500).json({ reply: 'Server configuration error. API key missing.' });
    }

    let systemPrompt = `You are PulseBot, an AI career assistant for JobPulseAI. Help users with:
- Resume improvement and optimization
- Job recommendations and job search strategies
- Interview preparation and tips
- Career advice and professional development

Keep your answers helpful, concise, and professional. Use emojis sparingly to keep things friendly.`;

    if (mode === 'career') {
      systemPrompt += '\n\nThe user has selected Career Advice mode. Focus specifically on career guidance, growth strategies, and professional development.';
    } else if (mode === 'jobs') {
      systemPrompt += '\n\nThe user has selected Job Finder mode. Focus specifically on job search strategies, job recommendations, and matching skills to roles.';
    } else if (mode === 'team') {
      systemPrompt += '\n\nThe user has selected Team Builder mode. Focus specifically on team building, hiring strategies, and collaboration.';
    } else if (mode === 'interview') {
      systemPrompt += '\n\nThe user has selected Interview Prep mode. Focus specifically on interview preparation, common questions, and answering techniques.';
    }

    const payload = {
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\nUser: ${message.trim()}` }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    // Try multiple models (lite models have higher free-tier rate limits)
    const models = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash'];
    let lastError = null;

    for (const model of models) {
      // Allow one retry per model for rate limits
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await response.json();

          // Rate limited — wait and retry once
          if (response.status === 429 && attempt === 0) {
            console.log(`⏳ Rate limited on ${model}, retrying in 2s...`);
            await new Promise(r => setTimeout(r, 2000));
            continue;
          }

          if (!response.ok) {
            console.error(`Gemini ${model} error (${response.status}):`, data?.error?.message || JSON.stringify(data));
            lastError = data?.error?.message || `HTTP ${response.status}`;
            break; // Try next model
          }

          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!reply) {
            console.error(`Empty response from ${model}:`, JSON.stringify(data, null, 2));
            lastError = 'Empty response';
            break;
          }

          console.log(`✅ Response from ${model}`);
          return res.json({ reply: reply.trim() });
        } catch (fetchErr) {
          console.error(`Fetch error for ${model}:`, fetchErr.message);
          lastError = fetchErr.message;
          break;
        }
      }
    }

    // All models failed
    console.error('All Gemini models failed. Last error:', lastError);
    res.status(502).json({ reply: `AI service is temporarily unavailable. Please try again in a minute.` });
  } catch (error) {
    console.error('Chat API Error:', error.message);
    res.status(500).json({ reply: 'Sorry, something went wrong. Please try again.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Chat server running on http://localhost:${PORT}`);
  console.log(`📡 POST /api/chat ready`);
});
