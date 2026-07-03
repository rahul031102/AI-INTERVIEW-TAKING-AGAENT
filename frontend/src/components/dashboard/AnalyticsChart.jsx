import { motion } from 'framer-motion';
import { BarChart3, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';
import GlassCard from '../common/GlassCard';

export default function AnalyticsChart({ chartData = [], avgScore = '0.0', totalCount = 0, successRate = 0 }) {
  const maxValue = chartData.length 
    ? Math.max(...chartData.map(d => d.value), 1) 
    : 10;

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
        {totalCount > 0 && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2 text-green-400 text-sm font-semibold"
          >
            <TrendingUp size={18} />
            Practice Active
          </motion.div>
        )}
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-64 gap-3 bg-white/5 rounded-2xl p-6">
        {chartData.map((item, index) => {
          const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <motion.div
              key={index}
              className="flex-1 flex flex-col items-center"
              initial={{ height: 0, opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.08 }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ delay: 0.3 + index * 0.08, duration: 0.8 }}
                className="w-full rounded-t-lg bg-gradient-to-t from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 transition-all cursor-pointer group relative min-h-[4px]"
              >
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {item.value}
                </div>
              </motion.div>
              <p className="text-xs text-zinc-400 mt-3">{item.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{avgScore}</p>
          <p className="text-xs text-zinc-400">Avg Score</p>
        </div>
        <div className="text-center border-l border-r border-white/10">
          <p className="text-2xl font-bold text-blue-400">{totalCount}</p>
          <p className="text-xs text-zinc-400">Interviews</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-400">{successRate}%</p>
          <p className="text-xs text-zinc-400">Success Rate</p>
        </div>
      </div>
    </GlassCard>
  );
}

AnalyticsChart.propTypes = {
  chartData: PropTypes.array,
  avgScore: PropTypes.string,
  totalCount: PropTypes.number,
  successRate: PropTypes.number,
};
