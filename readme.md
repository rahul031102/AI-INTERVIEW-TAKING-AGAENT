AI Interview & Resume Analyzer

An AI-powered mock interview and resume analysis platform built using modern full-stack technologies.
Features:
AI-powered mock interview system
Resume analyzer using Groq AI
PDF resume upload and parsing
Dynamic interview question generation
Technical skill extraction
Weakness and strength detection
Personalized interview questions
Modern React dashboard UI
MongoDB integration
REST API backend
Voice/interview foundation support
Tech Stack
Frontend
React
Vite
TailwindCSS
Framer Motion
Axios
React Router DOM
Backend
Node.js
Express.js
MongoDB
Mongoose
Multer
Groq API
pdfjs-dist
 
Folder Structure:
backend/
frontend/
Installation
Clone Repository
git clone https://github.com/rahul031102/ai_interview_and_resume_analyser.git

Backend Setup:
cd backend
npm 
install

Create .env

PORT=5000
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_api_key

Run backend:

node server.js
Frontend Setup
cd frontend
npm install
npm run dev
Resume Analyzer Flow
Upload Resume
    ↓
PDF Text Extraction
    ↓
Groq AI Analysis
    ↓
Structured JSON Response
    ↓
Frontend Rendering
Future Improvements
Authentication system
JWT protected routes
AI memory-based interviews
Adaptive follow-up questions
Interview analytics dashboard
Deployment
Real-time voice interviews
ATS scoring system
Job-description matching
Author

Rahul Kumar

GitHub:rahul03110222
