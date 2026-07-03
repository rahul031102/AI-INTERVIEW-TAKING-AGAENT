import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export default function GlassCard({ 
  children, 
  className = '', 
  animate = true,
  delay = 0,
  gradient = false,
}) {
  const baseClass = `
    rounded-[32px] backdrop-blur-xl border border-white/10 p-8
    transition-all duration-300 hover:border-white/20
  `;

  const gradientClass = gradient 
    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20'
    : 'bg-white/5';

  if (!animate) {
    return (
      <div className={`${baseClass} ${gradientClass} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${baseClass} ${gradientClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animate: PropTypes.bool,
  delay: PropTypes.number,
  gradient: PropTypes.bool,
};
