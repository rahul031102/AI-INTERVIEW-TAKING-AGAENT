import { motion } from 'framer-motion';

export default function AIThinking() {
  const orbs = [0, 1, 2];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex gap-3">
        {orbs.map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            className="h-3 w-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
          />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-sm text-zinc-400"
      >
        AI analyzing your response…
      </motion.p>
    </div>
  );
}
