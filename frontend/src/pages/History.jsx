import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/history')
      .then((res) => {
        setInterviews(res.data.interviews || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Interview History</h1>
        {loading ? (
          <p className="text-zinc-400 animate-pulse">Loading history...</p>
        ) : interviews.length === 0 ? (
          <p className="text-zinc-400">No interview sessions found yet.</p>
        ) : (
          <div className="space-y-6">
            {interviews.map((item) => (
              <div
                key={item._id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 transition duration-300 hover:border-purple-500/30"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-400">
                    {new Date(item.createdAt).toLocaleDateString()} at{' '}
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="bg-purple-500/10 text-purple-300 font-bold px-3 py-1 rounded-lg text-sm border border-purple-500/20">
                    Score: {item.score}
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  Q: {item.question}
                </h3>
                <p className="text-zinc-300 text-sm mb-4 bg-black/40 p-4 rounded-xl border border-white/5">
                  <strong className="text-zinc-400 text-xs block mb-1">
                    Your Answer:
                  </strong>
                  {item.answer}
                </p>
                <div className="text-xs text-zinc-400">
                  <strong className="text-zinc-300 text-xs block mb-1">
                    Detailed Feedback:
                  </strong>
                  <pre className="font-sans whitespace-pre-wrap leading-relaxed text-zinc-300">
                    {item.feedback}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
