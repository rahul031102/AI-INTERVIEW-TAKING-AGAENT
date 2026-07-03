import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';
import GlassCard from '../common/GlassCard';

export default function RecentInterviews({ interviews = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const getStatus = (score) => {
    if (!score) return 'good';
    const val = parseFloat(score);
    if (isNaN(val)) return 'good';
    return val >= 7.0 ? 'strong' : val >= 5.0 ? 'good' : 'weak';
  };

  return (
    <GlassCard delay={0.3}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Interviews</h2>
        <a
          href="/history"
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          View All →
        </a>
      </div>

      {interviews.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4">No recent interviews found. Head over to "Start Interview" to practice!</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {interviews.map((interview) => {
            const status = getStatus(interview.score);
            return (
              <motion.div
                key={interview._id}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition truncate">
                    {interview.question}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    {new Date(interview.createdAt).toLocaleDateString()} at{' '}
                    {new Date(interview.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className={`
                      text-lg font-bold px-3 py-1 rounded-lg
                      ${status === 'strong' ? 'bg-green-500/20 text-green-400' : ''}
                      ${status === 'good' ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${status === 'weak' ? 'bg-orange-500/20 text-orange-400' : ''}
                    `}
                  >
                    {interview.score}
                  </motion.div>

                  <div className="flex gap-2">
                    <a
                      href="/history"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                    >
                      <ExternalLink size={16} className="text-zinc-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </GlassCard>
  );
}

RecentInterviews.propTypes = {
  interviews: PropTypes.array,
};
