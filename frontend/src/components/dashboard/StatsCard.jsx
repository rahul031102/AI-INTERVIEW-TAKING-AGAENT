import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function StatsCard({ title, value, icon: Icon, change, gradient = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`
        rounded-[24px] p-6 border border-white/10 backdrop-blur-xl
        transition-all duration-300 cursor-pointer
        ${gradient 
          ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
          : 'bg-white/5'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-400 mb-2">{title}</p>
          <motion.h3
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white"
          >
            {value}
          </motion.h3>
          {change && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-xs mt-2 ${
                change.includes('+') ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {change}
            </motion.p>
          )}
        </div>
        {Icon && (
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20"
          >
            <Icon size={24} className="text-blue-400" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  change: PropTypes.string,
  gradient: PropTypes.bool,
};
