import { motion } from 'framer-motion';
import SidebarItem from './SidebarItem';
import { sidebarItems, bottomSidebarItems } from '../../data/sidebarData';

export default function Sidebar({ isOpen, onClose }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.username || 'User';
  const initial = name.charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <div
        className={`w-64 h-screen bg-slate-950 border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <div>
            <h1 className="text-white font-bold">InterviewAI</h1>
            <p className="text-xs text-zinc-500">Premium Platform</p>
          </div>
        </motion.div>

        {/* Main Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, staggerChildren: 0.1 }}
          className="flex-1 space-y-2"
        >
          {sidebarItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.08 }}>
              <SidebarItem item={item} onClick={onClose} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/10 pt-4 space-y-2"
        >
          {bottomSidebarItems.map((item) => (
            <SidebarItem key={item.id} item={item} onClick={onClose} />
          ))}
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 text-center"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {initial}
          </div>
          <p className="text-sm text-white font-medium capitalize">{name}</p>
          <p className="text-xs text-zinc-400">Premium Member</p>
        </motion.div>
      </div>
    </>
  );
}
