import { motion } from 'framer-motion';
import { Trash2, ExternalLink } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function RecentInterviews() {
  const interviews = [
    {
      id: 1,
      title: 'React Hooks & State Management',
      score: 8.5,
      date: '2 hours ago',
      status: 'strong',
    },
    {
      id: 2,
      title: 'REST API Design Patterns',
      score: 7.2,
      date: '1 day ago',
      status: 'good',
    },
    {
      id: 3,
      title: 'Database Optimization',
      score: 6.8,
      date: '3 days ago',
      status: 'weak',
    },
  ];

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

  return (
    <GlassCard delay={0.3}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Interviews</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-blue-400 hover:text-blue-300 transition"
        >
          View All →
        </motion.button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {interviews.map((interview) => (
          <motion.div
            key={interview.id}
            variants={itemVariants}
            whileHover={{ x: 8 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition">
                {interview.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">{interview.date}</p>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className={`
                  text-lg font-bold px-3 py-1 rounded-lg
                  ${interview.status === 'strong' ? 'bg-green-500/20 text-green-400' : ''}
                  ${interview.status === 'good' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${interview.status === 'weak' ? 'bg-orange-500/20 text-orange-400' : ''}
                `}
              >
                {interview.score}
              </motion.div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
                >
                  <ExternalLink size={16} className="text-zinc-400" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 transition"
                >
                  <Trash2 size={16} className="text-zinc-400 hover:text-red-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </GlassCard>
  );
}
