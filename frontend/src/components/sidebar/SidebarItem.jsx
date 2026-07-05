import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ item, onClick }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `block w-full transition-all duration-300 ${
          isActive
            ? 'text-white'
            : 'text-zinc-400 hover:text-white'
        }`
      }
    >
      <motion.div
        whileHover={{ x: 8 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
      >
        <Icon size={20} />
        <span className="text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className="ml-auto text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full">
            {item.badge}
          </span>
        )}
      </motion.div>
    </NavLink>
  );
}

SidebarItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    path: PropTypes.string.isRequired,
    badge: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};
