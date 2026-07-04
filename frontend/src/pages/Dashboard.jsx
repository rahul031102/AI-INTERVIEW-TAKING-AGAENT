import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import RecentInterviews from '../components/dashboard/RecentInterviews';
import WeakTopics from '../components/dashboard/WeakTopics';
import AIRecommendation from '../components/dashboard/AIRecommendation';
import DailyGoal from '../components/dashboard/DailyGoal';

export default function Dashboard() {
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
        console.error('Error fetching history:', err);
        setLoading(false);
      });
  }, []);

  const parseScoreVal = (scoreStr) => {
    if (!scoreStr) return 0;
    const match = scoreStr.match(/^(\d+(?:\.\d+)?)\s*\/\s*10/);
    if (match) return parseFloat(match[1]);
    const val = parseFloat(scoreStr);
    return isNaN(val) ? 0 : val;
  };

  // 1. Calculate Average Score
  const totalInterviews = interviews.length;
  const validScores = interviews.map(i => parseScoreVal(i.score)).filter(s => s > 0);
  const avgScore = validScores.length
    ? (validScores.reduce((sum, val) => sum + val, 0) / validScores.length).toFixed(1)
    : '0.0';

  // 2. Calculate Success Rate (score >= 7.0)
  const strongSessions = validScores.filter(s => s >= 7.0).length;
  const successRate = totalInterviews
    ? Math.round((strongSessions / totalInterviews) * 100)
    : 0;

  // 3. Calculate Streak of daily active sessions
  const calculateStreak = (sessions) => {
    if (!sessions.length) return 0;
    const dates = sessions.map(i => new Date(i.createdAt).toDateString());
    const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d));
    uniqueDates.sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const latest = uniqueDates[0];
    if (latest < yesterday) return 0;

    let current = new Date(latest);
    for (let i = 0; i < uniqueDates.length; i++) {
      const diff = Math.round((current - uniqueDates[i]) / (1000 * 60 * 60 * 24));
      if (diff === 0) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };
  const streak = calculateStreak(interviews);

  const statsData = [
    {
      title: 'Average Score',
      value: `${avgScore}/10`,
      icon: TrendingUp,
      change: totalInterviews ? 'Based on AI review' : 'No sessions yet',
      gradient: true,
    },
    {
      title: 'Total Sessions',
      value: `${totalInterviews}`,
      icon: Clock,
      change: 'All-time practice runs',
      gradient: false,
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: Target,
      change: 'Percentage of scores >= 7',
      gradient: false,
    },
    {
      title: 'Streak',
      value: `${streak} Days`,
      icon: Zap,
      change: streak > 0 ? 'Keep practicing daily!' : 'Start a new streak today',
      gradient: false,
    },
  ];

  // 4. Extract Weak Topics count
  const extractWeakTopics = (sessions) => {
    const counts = {};
    sessions.forEach(i => {
      if (Array.isArray(i.weakTopics)) {
        i.weakTopics.forEach(topic => {
          const clean = topic.replace(/^-\s*/, '').trim();
          if (clean) {
            counts[clean] = (counts[clean] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([topic, count]) => ({
        topic,
        count,
        color: count >= 3 ? 'red' : count === 2 ? 'orange' : 'yellow',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };
  const weakTopics = extractWeakTopics(interviews);

  // 5. Extract Weekly Progression Chart Data
  const getChartData = (sessions) => {
    // default/fallback chart if no sessions
    if (!sessions.length) {
      return [
        { label: 'Mon', value: 0 },
        { label: 'Tue', value: 0 },
        { label: 'Wed', value: 0 },
        { label: 'Thu', value: 0 },
        { label: 'Fri', value: 0 },
        { label: 'Sat', value: 0 },
        { label: 'Sun', value: 0 },
      ];
    }
    return sessions
      .slice(0, 7)
      .reverse()
      .map(i => ({
        label: new Date(i.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
        value: parseScoreVal(i.score),
      }));
  };
  const chartData = getChartData(interviews);

  // 6. Calculate interviews done today
  const todayCount = interviews.filter(i => {
    const d = new Date(i.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse text-lg">Loading your dashboard analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-black min-h-screen">
      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
      >
        {/* Left Column - Analytics & Interviews */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnalyticsChart chartData={chartData} avgScore={avgScore} totalCount={totalInterviews} successRate={successRate} />
          <RecentInterviews interviews={interviews.slice(0, 5)} />
        </motion.div>

        {/* Right Column - Weak Topics & Recommendation */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <WeakTopics weakTopics={weakTopics} />
          <AIRecommendation weakTopics={weakTopics} />
        </motion.div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DailyGoal todayCount={todayCount} avgScore={avgScore} />
      </motion.div>
    </div>
  );
}
