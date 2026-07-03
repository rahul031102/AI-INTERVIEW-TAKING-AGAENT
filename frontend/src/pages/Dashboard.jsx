import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import RecentInterviews from '../components/dashboard/RecentInterviews';
import WeakTopics from '../components/dashboard/WeakTopics';
import AIRecommendation from '../components/dashboard/AIRecommendation';
import DailyGoal from '../components/dashboard/DailyGoal';

export default function Dashboard() {
  const statsData = [
    {
      title: 'Average Score',
      value: '8.7',
      icon: TrendingUp,
      change: '+2.5% from last week',
      gradient: true,
    },
    {
      title: 'Total Interviews',
      value: '24',
      icon: Clock,
      change: '+3 this week',
      gradient: false,
    },
    {
      title: 'Success Rate',
      value: '85%',
      icon: Target,
      change: '+5% improvement',
      gradient: false,
    },
    {
      title: 'Streak',
      value: '7',
      icon: Zap,
      change: 'Keep it up!',
      gradient: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <div className="p-8">
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
          <AnalyticsChart />
          <RecentInterviews />
        </motion.div>

        {/* Right Column - Weak Topics & Recommendation */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <WeakTopics />
          <AIRecommendation />
        </motion.div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <DailyGoal />
      </motion.div>
    </div>
  );
}
