import { useState } from 'react';
import axios from 'axios';

export default function PremiumInterviewUI() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [weakTopics, setWeakTopics] = useState([]);
  const [nextQuestion, setNextQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const parseSection = (text, start, end) => {
    const regex = new RegExp(`${start}\\s*([\\s\\S]*?)${end}`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const getQuestion = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/question');
      setQuestion(res.data.question);
      setFeedback('');
      setScore('');
      setStrengths('');
      setWeaknesses('');
      setWeakTopics([]);
      setNextQuestion('');
      setAnswer('');
      speakText(res.data.question);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported');
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
    if (!question) return;
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/evaluate', {
        question,
        answer,
      });

      const feedbackText = res.data.feedback;
      setFeedback(feedbackText);

      const scoreMatch = feedbackText.match(/Score:\s*(.*)/);
      const strengthsText = parseSection(
        feedbackText,
        'Strengths:',
        'Weaknesses:'
      );
      const weaknessesText = parseSection(
        feedbackText,
        'Weaknesses:',
        'Weak Topics:'
      );
      const topicsText = parseSection(
        feedbackText,
        'Weak Topics:',
        'Follow-Up Question:'
      );
      const followUpMatch = feedbackText.match(/Follow-Up Question:\s*(.*)/s);

      setScore(scoreMatch ? scoreMatch[1].trim() : 'N/A');
      setStrengths(strengthsText || 'Clear explanation and structure.');
      setWeaknesses(weaknessesText || 'More depth needed in token flow.');
      setWeakTopics(
        topicsText
          ? topicsText
              .split('-')
              .map((topic) => topic.trim())
              .filter(Boolean)
          : []
      );

      if (followUpMatch) {
        setNextQuestion(followUpMatch[1].trim());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Live Interview</h2>
            <p className="text-zinc-400 mt-1">MERN Stack Interview</p>
          </div>

          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-green-300 text-sm">AI Active</p>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-3xl p-6 mb-6">
          <p className="text-sm text-zinc-400 mb-3">Interview Question</p>
          <h3 className="text-xl leading-relaxed font-medium">
            {question || 'Press Start Interview to receive your first question.'}
          </h3>
        </div>

        <div className="flex items-center justify-center gap-2 py-6">
          <div className="w-3 h-10 rounded-full bg-purple-400 animate-pulse" />
          <div className="w-3 h-16 rounded-full bg-blue-400 animate-pulse delay-75" />
          <div className="w-3 h-8 rounded-full bg-purple-400 animate-pulse delay-150" />
          <div className="w-3 h-14 rounded-full bg-blue-400 animate-pulse delay-300" />
          <div className="w-3 h-10 rounded-full bg-purple-400 animate-pulse delay-500" />
        </div>

        <div className="bg-black/40 border border-white/10 rounded-3xl p-5 mb-6">
          <p className="text-zinc-500 mb-3">Your Answer...</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Speak or type your answer here..."
            className="w-full mb-4 bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[140px] text-white outline-none"
          />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              onClick={startListening}
              className="w-full sm:w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300"
            >
              {isListening ? '🎙️' : '🎤'}
            </button>

            <button
              onClick={question ? submitAnswer : getQuestion}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-300 text-lg font-semibold"
            >
              {loading ? 'Processing...' : (question ? 'Submit Response' : 'Start Interview')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
            <p className="text-green-300 text-sm mb-2">Strength</p>
            <h4 className="font-semibold text-lg">{strengths || 'Clear Explanation'}</h4>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <p className="text-red-300 text-sm mb-2">Weakness</p>
            <h4 className="font-semibold text-lg">{weaknesses || 'JWT Depth Missing'}</h4>
          </div>
        </div>

        {score && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-3xl p-5">
            <p className="text-zinc-400 mb-1">Score</p>
            <p className="text-3xl font-bold">{score}</p>
          </div>
        )}

        {weakTopics.length > 0 && (
          <div className="mt-6 bg-black/40 border border-white/10 rounded-3xl p-5">
            <p className="text-zinc-400 mb-3">Weak Topics</p>
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((topic, index) => (
                <span
                  key={index}
                  className="bg-white/10 border border-white/10 rounded-full px-4 py-2 text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {nextQuestion && (
          <button
            onClick={() => {
              setQuestion(nextQuestion);
              speakText(nextQuestion);
              setAnswer('');
              setFeedback('');
              setScore('');
              setStrengths('');
              setWeaknesses('');
              setWeakTopics([]);
              setNextQuestion('');
            }}
            className="mt-6 w-full bg-purple-600 px-6 py-3 rounded-xl text-lg font-semibold"
          >
            Next AI Follow-Up Question
          </button>
        )}
      </div>
    </div>
  );
}
