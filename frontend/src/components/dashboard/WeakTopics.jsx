import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import GlassCard from '../common/GlassCard';

export default function WeakTopics({ weakTopics = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const topTopic = weakTopics[0]?.topic;

  return (
    <GlassCard delay={0.4}>
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={24} className="text-orange-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Weak Topics</h2>
          <p className="text-sm text-zinc-400">Areas to improve</p>
        </div>
      </div>

      {weakTopics.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">No weak topics detected yet. Complete some interviews to identify weaknesses!</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3"
        >
          {weakTopics.map((item, index) => (
            <motion.button
              key={index}
              variants={tagVariants}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer
                border backdrop-blur-sm
                ${item.color === 'red' ? 'bg-red-500/20 border-red-500/30 text-red-200 hover:bg-red-500/30' : ''}
                ${item.color === 'orange' ? 'bg-orange-500/20 border-orange-500/30 text-orange-200 hover:bg-orange-500/30' : ''}
                ${item.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-200 hover:bg-yellow-500/30' : ''}
              `}
            >
              <span>{item.topic}</span>
              <span className="ml-2 text-xs opacity-75">({item.count})</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20"
      >
        <p className="text-sm text-orange-200">
          💡 <strong>Recommendation:</strong>{' '}
          {topTopic
            ? `Complete 3 more ${topTopic} interviews to build your technical depth and confidence.`
            : 'You are doing great! Start a new mock interview to evaluate your technical skills.'}
        </p>
      </motion.div>
    </GlassCard>
  );
}

WeakTopics.propTypes = {
  weakTopics: PropTypes.array,
};
