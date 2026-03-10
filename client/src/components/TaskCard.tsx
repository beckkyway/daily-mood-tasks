import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: () => void;
}

export function TaskCard({ task, index, onToggle }: TaskCardProps) {
  const isCompleted = task.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`
        relative overflow-hidden rounded-2xl p-5 
        bg-white shadow-pastel hover:shadow-pastel-hover
        border-2 transition-all duration-300 group
        ${isCompleted ? 'border-green-100 bg-green-50/30' : 'border-transparent'}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className={`
          flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl text-2xl
          transition-colors duration-300
          ${isCompleted ? 'bg-green-100 grayscale opacity-60' : 'bg-primary/10'}
        `}>
          {task.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <h3 className={`
            text-lg font-bold transition-all duration-300 font-display
            ${isCompleted ? 'text-muted-foreground line-through decoration-green-400/50 decoration-2' : 'text-foreground'}
          `}>
            {task.title}
          </h3>
          <p className={`
            mt-1 text-sm transition-all duration-300 leading-relaxed
            ${isCompleted ? 'text-muted-foreground/60' : 'text-muted-foreground'}
          `}>
            {task.description}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onToggle}
          className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20
            ${isCompleted 
              ? 'bg-green-400 text-white shadow-lg shadow-green-400/30 hover:bg-green-500 scale-110' 
              : 'bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary'
            }
          `}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-5 h-5 stroke-[3]" />
            </motion.div>
          ) : (
            <Circle className="w-6 h-6 stroke-[2]" />
          )}
        </button>
      </div>

      {/* Decorative background flash on complete */}
      {isCompleted && (
        <motion.div 
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 bg-green-400 rounded-full z-[-1] pointer-events-none origin-right"
          style={{ right: '1.25rem', top: '1.25rem', width: '2.5rem', height: '2.5rem' }}
        />
      )}
    </motion.div>
  );
}
