import { motion } from "framer-motion";
import Mascota from "./Mascota";

export default function ChatBubble({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="shrink-0 mt-0.5">
        <Mascota size={32} />
      </div>
      <div className="bg-kallpa-cream rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-kallpa-coral-dark leading-relaxed max-w-[85%]">
        {children}
      </div>
    </motion.div>
  );
}
