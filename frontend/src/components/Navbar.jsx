import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-white/10 py-5"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Premium
          </p>
          <h1 className="text-2xl font-bold">Mock Interview AI</h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live AI Interview
        </div>
      </div>
    </motion.nav>
  );
}
