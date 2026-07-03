import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function Hero({ onStart, interviewStarted }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-12"
    >
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm uppercase tracking-[0.3em] text-green-300/80"
          >
            Premium interview platform
          </motion.p>

          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold leading-tight text-white"
          >
            Crack{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Software
            </span>{' '}
            Interviews.
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-lg text-zinc-400"
          >
            Start a live MERN stack interview, speak your response, and receive instant AI feedback with follow-up questions.
          </motion.p>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="rounded-3xl bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_60px_rgba(124,58,237,0.25)] transition"
          >
            {interviewStarted ? 'Continue Interview' : 'Start Interview'}
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)]"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-5 rounded-3xl border border-white/10 bg-slate-950/80 p-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">AI interviewer</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Live coaching session</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Speak your answer, get an AI-rated score, and receive insight into your weak topics.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-5"
            >
              <p className="text-sm text-zinc-400">Session status</p>
              <p className="mt-2 font-semibold text-white">
                {interviewStarted ? 'Waiting for answer' : 'Ready to begin'}
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-slate-950/80 p-5"
            >
              <p className="text-sm text-zinc-400">Platform</p>
              <p className="mt-2 font-semibold text-white">Real AI + Voice Interview</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
