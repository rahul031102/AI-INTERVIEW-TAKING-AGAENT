import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';

export default function DailyGoal() {
  const progress = 75;

  return (
    <GlassCard delay={0.6}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Daily Goal</h2>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-3xl font-bold text-green-400"
        >
          {progress}%
        </motion.span>
      </div>

      <div className="w-full h-6 rounded-full bg-white/10 overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]"
        />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-zinc-400 leading-relaxed text-sm mb-6"
      >
        Complete <strong className="text-white">2 more interviews</strong> today to hit your target.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-white">3/5</p>
          <p className="text-xs text-zinc-400 mt-1">Interviews Today</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-green-400">8.4</p>
          <p className="text-xs text-zinc-400 mt-1">Avg Score</p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transition-all"
      >
        Continue Interview Session
      </motion.button>
    </GlassCard>
  );
}
