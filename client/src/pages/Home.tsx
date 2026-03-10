import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, RefreshCw } from "lucide-react";
import type { Task, EnergyLevel } from "@shared/schema";
import { useGenerateChallenge } from "@/hooks/use-challenges";
import { EnergySelector } from "@/components/EnergySelector";
import { TaskCard } from "@/components/TaskCard";
import { ProgressBar } from "@/components/ProgressBar";

export default function Home() {
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const { mutate: generateTasks, isPending } = useGenerateChallenge();

  const completedCount = tasks.filter(t => t.completed).length;
  const isAllDone = tasks.length > 0 && completedCount === tasks.length;

  // Trigger confetti when all tasks are done
  useEffect(() => {
    if (isAllDone) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a78bfa', '#f472b6', '#34d399', '#fbbf24']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a78bfa', '#f472b6', '#34d399', '#fbbf24']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isAllDone]);

  const handleGenerate = () => {
    generateTasks(
      { energyLevel: energy },
      {
        onSuccess: (data) => {
          // Reset tasks with fresh completion status
          setTasks(data.tasks.map(t => ({ ...t, completed: false })));
        },
      }
    );
  };

  const toggleTask = (index: number) => {
    setTasks(prev => {
      const newTasks = [...prev];
      newTasks[index] = { ...newTasks[index], completed: !newTasks[index].completed };
      return newTasks;
    });
  };

  const resetFlow = () => {
    setTasks([]);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-x-hidden">
      <main className="w-full max-w-md mx-auto">
        
        {/* Header */}
        <header className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-pastel mb-4 text-primary"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Spark</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Tiny missions to brighten your day.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {tasks.length === 0 ? (
            /* STATE 1: SELECTION */
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <EnergySelector 
                value={energy} 
                onChange={setEnergy} 
                disabled={isPending} 
              />
              
              <button
                onClick={handleGenerate}
                disabled={isPending}
                className="
                  w-full py-4 px-6 rounded-2xl font-bold text-lg text-white
                  bg-gradient-to-r from-primary to-accent
                  shadow-[0_8px_30px_rgb(167,139,250,0.4)]
                  hover:shadow-[0_12px_40px_rgb(167,139,250,0.5)]
                  hover:-translate-y-1 active:translate-y-0
                  transition-all duration-300 disabled:opacity-70 disabled:cursor-wait
                  flex items-center justify-center gap-3 relative overflow-hidden
                "
              >
                {isPending ? (
                  <>
                    <div className="flex gap-1">
                      <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-white rounded-full block" />
                      <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full block" />
                      <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full block" />
                    </div>
                    <span>Brewing magic...</span>
                  </>
                ) : (
                  <>
                    <span>Generate My Day</span>
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
                
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              </button>
            </motion.div>
          ) : (
            /* STATE 2: ACTIVE TASKS */
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl p-6 shadow-pastel">
                <ProgressBar completed={completedCount} total={tasks.length} />
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {tasks.map((task, idx) => (
                    <TaskCard 
                      key={`${task.title}-${idx}`} 
                      task={task} 
                      index={idx}
                      onToggle={() => toggleTask(idx)} 
                    />
                  ))}
                </AnimatePresence>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3 pt-4"
              >
                {isAllDone && (
                  <div className="text-center p-4 bg-green-50 text-green-700 rounded-2xl font-bold font-display animate-bounce">
                    🎉 You crushed it today! 🎉
                  </div>
                )}
                
                <button
                  onClick={resetFlow}
                  className="
                    w-full py-3 px-6 rounded-2xl font-bold text-muted-foreground bg-secondary
                    hover:bg-primary/10 hover:text-primary transition-all duration-300
                    flex items-center justify-center gap-2
                  "
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Start Over</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
