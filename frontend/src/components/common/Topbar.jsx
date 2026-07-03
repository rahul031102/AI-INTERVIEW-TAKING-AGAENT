import { motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';

export default function Topbar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-slate-950/80 to-transparent border-b border-white/10 px-8 py-4 flex items-center justify-between backdrop-blur-xl"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Welcome back to your interview preparation journey</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
          <Search size={18} className="text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-white placeholder-zinc-500"
          />
        </div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <Bell size={20} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </motion.button>

        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center cursor-pointer"
        >
          <span className="text-white font-bold text-sm">R</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
