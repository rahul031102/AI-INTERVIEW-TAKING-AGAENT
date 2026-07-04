import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import InterviewPanel from '../components/InterviewPanel';
import FeedbackPanel from '../components/FeedbackPanel';

export default function InterviewPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [weakTopics, setWeakTopics] = useState([]);
  const [nextQuestion, setNextQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const parseSection = (text, start, end) => {
    const regex = new RegExp(`${start}\\s*([\\s\\S]*?)${end}`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const getQuestion = async () => {
    try {
      setLoading(true);
      const res = await api.get('/question');
      setQuestion(res.data.question || 'Welcome to the interview.');
      setAnswer('');
      setFeedback('');
      setScore('');
      setStrengths('');
      setWeaknesses('');
      setWeakTopics([]);
      setNextQuestion('');
      setInterviewStarted(true);
    } catch (error) {
      console.error(error);
      setFeedback('Unable to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedback('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswer(transcript);
    };

    recognition.start();
  };

  const submitAnswer = async () => {
    if (!question) {
      setFeedback('Please start the interview first.');
      return;
    }

    if (!answer.trim()) {
      setFeedback('Please write or record an answer before submitting.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/evaluate', {
        question,
        answer,
      });

      const feedbackText = res.data.feedback || 'No feedback returned.';
      setFeedback(feedbackText);

      const scoreMatch = feedbackText.match(/Score:\s*(.*)/);
      const strengthsText = parseSection(feedbackText, 'Strengths:', 'Weaknesses:');
      const weaknessesText = parseSection(feedbackText, 'Weaknesses:', 'Weak Topics:');
      const topicsText = parseSection(feedbackText, 'Weak Topics:', 'Follow-Up Question:');
      const followUpMatch = feedbackText.match(/Follow-Up Question:\s*(.*)/s);

      setScore(scoreMatch ? scoreMatch[1].trim() : 'N/A');
      setStrengths(strengthsText || 'Clear explanation and structure.');
      setWeaknesses(weaknessesText || 'More depth needed in technical detail.');
      setWeakTopics(
        topicsText
          ? topicsText
              .split('-')
              .map((topic) => topic.trim())
              .filter(Boolean)
          : []
      );
      setNextQuestion(followUpMatch ? followUpMatch[1].trim() : '');
    } catch (error) {
      console.error(error);
      setFeedback('AI evaluation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!nextQuestion) return;
    setQuestion(nextQuestion);
    setAnswer('');
    setFeedback('');
    setScore('');
    setStrengths('');
    setWeaknesses('');
    setWeakTopics([]);
    setNextQuestion('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-black"
    >
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        {!interviewStarted ? (
          <Hero onStart={getQuestion} interviewStarted={interviewStarted} />
        ) : (
          <div className="space-y-8">
            <InterviewPanel
              question={question}
              answer={answer}
              setAnswer={setAnswer}
              onStartListening={startListening}
              isListening={isListening}
              onSubmit={submitAnswer}
              loading={loading}
              interviewStarted={interviewStarted}
            />
            <FeedbackPanel
              score={score}
              strengths={strengths}
              weaknesses={weaknesses}
              weakTopics={weakTopics}
              nextQuestion={nextQuestion}
              onNextQuestion={handleNextQuestion}
              feedback={feedback}
              loading={loading}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
