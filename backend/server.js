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

app.use(cors({ origin: (process.env.CLIENT_URL || "http://localhost:5173").trim() }));
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
  const { topic = 'MERN stack', difficulty = 'beginner', exclude = '[]', history = '[]' } = req.query;
  let excludedQuestions = [];
  try {
    excludedQuestions = JSON.parse(exclude);
  } catch (e) {
    excludedQuestions = [];
  }

  let parsedHistory = [];
  try {
    parsedHistory = JSON.parse(history);
  } catch (e) {
    parsedHistory = [];
  }

  const historyBlock = parsedHistory.length
    ? parsedHistory.map((h, i) => `Q${i + 1}: ${h.question}\nCandidate's Answer: ${h.answer}\n`).join('\n')
    : '(This is the first question of the interview.)';

  // MERN Stack is an umbrella, not a real single subject — pick one
  // specific technology per question instead of asking a blended,
  // vague "MERN stack" question every time.
  let effectiveTopic = topic;
  if (/mern/i.test(topic)) {
    const mernParts = ['MongoDB', 'Express.js', 'React', 'Node.js'];
    effectiveTopic = mernParts[Math.floor(Math.random() * mernParts.length)];
  }

  const randomSeed = Math.floor(Math.random() * 100000);

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9,
      messages: [
        {
          role: 'user',
          content:
            `You are a senior technical interviewer at a real software company conducting a live interview. Ask one ${difficulty}-level ${effectiveTopic} interview question, phrased the way a real interviewer would say it out loud.

(Internal variety seed: ${randomSeed} — use this to genuinely vary which specific concept you pick, don't default to the most commonly asked question for this topic.)

Match the question STYLE to the difficulty level:
- If difficulty is "beginner": ask a direct, conversational explain/definition-style question about a core concept (e.g. "Can you explain what middleware is in Express.js and why we use it?"). Keep it approachable, one concept at a time — NOT a multi-step scenario or system design question.
- If difficulty is "intermediate": mix a moderate scenario question with a deeper conceptual one, introducing simple design or debugging tradeoffs.
- If difficulty is "advanced": scenario-based, system-design, or architecture/tradeoff questions are appropriate.

Avoid generic questions like "What is the difference between X and Y" unless genuinely necessary for the topic.
Do NOT repeat or closely rephrase any of these already-asked questions:
${excludedQuestions.length ? excludedQuestions.map((q) => `- ${q}`).join('\n') : '(none yet)'}

Conversation history so far:
${historyBlock}

Return only the question text, no preamble.`,
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
    const { question, answer, history = [] } = req.body;

    const historyBlock = history.length
      ? history.map((h, i) => `Q${i + 1}: ${h.question}\nCandidate's Answer: ${h.answer}\n`).join('\n')
      : '(This is the first question of the interview.)';

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.85,
      messages: [
        {
          role: 'user',
          content: `
You are conducting one continuous, adaptive technical interview — not a quiz with isolated questions. You remember everything the candidate has said so far and let it genuinely shape what you ask next, the same way a real interviewer builds on a conversation rather than reading from a fixed script.

Conversation so far:
${historyBlock}

Interview Question:
${question}

Candidate Answer:
${answer}

Your task:
1. Evaluate the answer
2. Detect weak technical areas
3. Decide if the candidate is weak or strong on this specific point
4. Generate the next question the way a real interviewer would choose it: if the answer was strong, go deeper into the same area or raise the difficulty; if it was weak or vague, ask a clarifying follow-up on exactly what was unclear; if this topic has been covered enough already based on the conversation so far, move to a genuinely different angle instead of circling back. Never repeat a question already asked above.

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