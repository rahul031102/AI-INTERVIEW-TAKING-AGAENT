import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Groq from 'groq-sdk';
import Interview from './models/Interview.js';
import resumeRoutes from './routes/resumeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());
// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log('REQ', req.method, req.path);
  next();
});

app.use('/auth', authRoutes);
app.use('/resume', authMiddleware, resumeRoutes);

// Debug: list mounted resume routes
try {
  console.log('Mounted resumeRoutes stack:', resumeRoutes.stack?.map(s => s.route?.path || s.name));
} catch (e) {
  console.log('Could not list resumeRoutes stack', e);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window per IP
  message: { error: 'Too many requests. Please try again later.' },
});

app.get('/question', authMiddleware, aiLimiter, async (req, res) => {
  const { topic = 'MERN stack', difficulty = 'beginner' } = req.query;
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'user',
          content:
            `Ask one ${difficulty} level ${topic} interview question. Return only the question, no preamble.`,
        },
      ],
    });

    res.json({
      question: response.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Something went wrong',
    });
  }
});

app.post('/evaluate', authMiddleware, aiLimiter, async (req, res) => {
  try {
    const { question, answer } = req.body;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',

      messages: [
        {
          role: 'user',
          content: `
You are an intelligent senior software engineering interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Your task:
1. Evaluate the answer
2. Detect weak technical areas
3. Decide if candidate is weak or strong
4. Generate a smart follow-up question

Return STRICTLY in this format:

Score: x/10

Strengths:
- ...

Weaknesses:
- ...

Weak Topics:
- ...

Follow-Up Question:
...

Keep response concise.
`,
        },
      ],
    });

    const feedbackText = response.choices[0].message.content;
    const scoreMatch = feedbackText.match(/Score:\s*(.*)/);
    const weakTopicsMatch = feedbackText.match(/Weak Topics:\s*([\s\S]*?)Follow-Up Question/);
    const savedInterview = await Interview.create({
      question,
      answer,
      feedback: feedbackText,
      score: scoreMatch ? scoreMatch[1] : 'N/A',
      weakTopics: weakTopicsMatch
        ? weakTopicsMatch[1]
            .split('-')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      userId: req.user.id,
    });

    res.json({
      feedback: feedbackText,
      savedInterview,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Evaluation failed',
    });
  }
});

app.get('/history', authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ interviews });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: 'Could not load interview history',
    });
  }
});

// Global error logger to capture middleware errors
app.use((err, req, res, next) => {
  console.error('EXPRESS ERROR', err && err.message ? err.message : err);
  try {
    res.status(500).json({ error: err?.message || 'Internal Server Error', details: String(err) });
  } catch (e) {
    console.error('Error sending error response', e);
    next(e);
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});