import { motion } from "framer-motion";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const isAllDone = completed === total && total > 0;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end px-1">
        <span className="text-sm font-bold text-muted-foreground font-display uppercase tracking-wide">
          Your Progress
        </span>
        <motion.span 
          key={completed}
          initial={{ scale: 1.5, color: "hsl(var(--primary))" }}
          animate={{ scale: 1, color: "hsl(var(--muted-foreground))" }}
          className="text-sm font-bold bg-secondary px-3 py-1 rounded-full"
        >
          {completed} / {total}
        </motion.span>
      </div>
      
      <div className="h-4 w-full bg-secondary rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          className={`h-full absolute top-0 left-0 rounded-full ${isAllDone ? 'bg-green-400' : 'bg-primary'}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Subtle shimmer effect on the progress bar */}
        {percentage > 0 && !isAllDone && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        )}
      </div>
    </div>
  );
}
