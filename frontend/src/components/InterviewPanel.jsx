import { motion } from 'framer-motion';
import VoiceVisualizer from './VoiceVisualizer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function InterviewPanel({
  question,
  answer,
  setAnswer,
  onStartListening,
  isListening,
  onSubmit,
  loading,
  interviewStarted,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)]"
    >
      <motion.div
        className="flex flex-col gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Interview Question</p>
          <h3 className="mt-4 text-xl font-semibold text-white leading-relaxed">
            {question || 'Press Start Interview to receive your first AI prompt.'}
          </h3>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6"
        >
          <p className="text-sm text-zinc-400 mb-3">Your Answer...</p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Talk or type your answer here..."
            className="min-h-[170px] w-full rounded-3xl border border-white/10 bg-black/40 p-5 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
          />

          <motion.div
            className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              type="button"
              onClick={onStartListening}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="inline-flex h-14 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 px-6 text-2xl transition shadow-[0_10px_30px_rgba(124,58,237,0.3)]"
            >
              {isListening ? '🎙️' : '🎤'}
            </motion.button>

            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={loading || !interviewStarted}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-3xl bg-white/10 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'AI is evaluating...' : 'Submit Response'}
            </motion.button>
          </motion.div>

          {isListening && <VoiceVisualizer />}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
