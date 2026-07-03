import { motion } from 'framer-motion';

const bars = [20, 36, 26, 42, 30];

export default function VoiceVisualizer() {
  return (
    <div className="mt-5 flex items-end justify-center gap-2 px-2">
      {bars.map((height, index) => (
        <motion.span
          key={index}
          animate={{ height: [height, height * 0.4, height] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.08 }}
          className="block w-3 rounded-full bg-gradient-to-t from-purple-500 to-blue-400"
          style={{ minHeight: 20 }}
        />
      ))}
    </div>
  );
}
