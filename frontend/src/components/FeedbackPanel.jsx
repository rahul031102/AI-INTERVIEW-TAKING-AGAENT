import { motion } from 'framer-motion';
import AIThinking from './AIThinking';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FeedbackPanel({
  score,
  strengths,
  weaknesses,
  weakTopics,
  nextQuestion,
  onNextQuestion,
  feedback,
  loading,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"
    >
      <motion.div
        className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
        variants={itemVariants}
      >
        <motion.div
          className="flex items-center justify-between gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">AI feedback</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Review summary</h3>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-200"
          >
            {score || 'N/A'} / 10
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-4 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5 cursor-pointer transition"
          >
            <p className="text-sm text-green-200">Strength</p>
            <p className="mt-3 text-lg font-semibold text-white">
              {strengths || 'Clear explanation'}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 cursor-pointer transition"
          >
            <p className="text-sm text-red-200">Weakness</p>
            <p className="mt-3 text-lg font-semibold text-white">
              {weaknesses || 'Needs deeper JWT coverage'}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-5"
        >
          <p className="text-sm text-zinc-400">Weak Topics</p>
          <motion.div
            className="mt-4 flex flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {weakTopics.length > 0 ? (
              weakTopics.map((topic, index) => (
                <motion.span
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white cursor-pointer transition"
                >
                  {topic}
                </motion.span>
              ))
            ) : (
              <p className="text-sm text-zinc-500">AI will highlight weak areas here.</p>
            )}
          </motion.div>
        </motion.div>

        {nextQuestion && (
          <motion.button
            type="button"
            onClick={onNextQuestion}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 w-full rounded-3xl bg-purple-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-purple-500 shadow-[0_10px_30px_rgba(147,51,234,0.3)]"
          >
            Next AI Follow-Up Question
          </motion.button>
        )}
      </motion.div>

      <motion.div
        className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
        variants={itemVariants}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Detailed feedback</p>
        <motion.div
          className="mt-5 min-h-[260px] rounded-3xl border border-white/10 bg-black/40 p-6 text-sm leading-relaxed text-zinc-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <AIThinking />
          ) : feedback ? (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="whitespace-pre-wrap text-sm text-zinc-200"
            >
              {feedback}
            </motion.pre>
          ) : (
            <p className="text-zinc-500">Your AI feedback will appear here after submission.</p>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
