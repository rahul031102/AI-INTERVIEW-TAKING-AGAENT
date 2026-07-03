import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function AIRecommendation() {
  return (
    <GlassCard gradient delay={0.5}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500"
          >
            <Sparkles size={24} className="text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white">AI Recommendation</h2>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-zinc-200 leading-relaxed mb-6 text-sm"
      >
        Based on your recent performance, focus on <strong>authentication flows</strong> and 
        <strong> backend system design</strong> to significantly improve your interview performance. 
        These topics appear in 40% of FAANG interviews.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">Recommended Topics:</p>
        <div className="flex flex-wrap gap-2">
          {['OAuth 2.0', 'JWT', 'Microservices', 'Load Balancing'].map((topic, index) => (
            <motion.span
              key={topic}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/20 text-white"
            >
              {topic}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-6 py-4 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100 transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
      >
        Start Recommended Interview
      </motion.button>
    </GlassCard>
  );
}
