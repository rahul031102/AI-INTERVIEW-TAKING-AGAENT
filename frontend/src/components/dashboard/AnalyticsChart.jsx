import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import GlassCard from '../common/GlassCard';

export default function AnalyticsChart() {
  const chartData = [
    { label: 'Mon', value: 7 },
    { label: 'Tue', value: 8.2 },
    { label: 'Wed', value: 7.8 },
    { label: 'Thu', value: 8.5 },
    { label: 'Fri', value: 9 },
    { label: 'Sat', value: 8.7 },
    { label: 'Sun', value: 9.2 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <GlassCard gradient delay={0.2}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={24} />
            Performance Analytics
          </h2>
          <p className="text-sm text-zinc-400 mt-1">Weekly score progression</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-2 text-green-400 text-sm font-semibold"
        >
          <TrendingUp size={18} />
          +12% this week
        </motion.div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-64 gap-3 bg-white/5 rounded-2xl p-6">
        {chartData.map((item, index) => (
          <motion.div
            key={item.label}
            className="flex-1 flex flex-col items-center"
            initial={{ height: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.08 }}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: 0.3 + index * 0.08, duration: 0.8 }}
              className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 transition-all cursor-pointer group relative"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-white text-xs whitespace-nowrap"
              >
                {item.value}
              </motion.div>
            </motion.div>
            <p className="text-xs text-zinc-400 mt-3">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">8.6</p>
          <p className="text-xs text-zinc-400">Avg Score</p>
        </div>
        <div className="text-center border-l border-r border-white/10">
          <p className="text-2xl font-bold text-blue-400">12</p>
          <p className="text-xs text-zinc-400">Interviews</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">85%</p>
          <p className="text-xs text-zinc-400">Consistency</p>
        </div>
      </div>
    </GlassCard>
  );
}
