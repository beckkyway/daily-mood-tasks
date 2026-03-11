import { motion } from "framer-motion";
import type { EnergyLevel } from "@shared/schema";

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (value: EnergyLevel) => void;
  disabled?: boolean;
}

const options: { level: EnergyLevel; label: string; icon: string; color: string }[] = [
  { level: "low", label: "Низкая", icon: "😴", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { level: "medium", label: "Средняя", icon: "😊", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { level: "high", label: "Высокая", icon: "⚡", color: "bg-pink-100 text-pink-700 border-pink-200" },
];

export function EnergySelector({ value, onChange, disabled }: EnergySelectorProps) {
  return (
    <div className="space-y-4 w-full">
      <label className="block text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Как ты себя чувствуешь?
      </label>
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = value === option.level;
          return (
            <button
              key={option.level}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.level)}
              className={`
                relative flex flex-col items-center justify-center p-4 rounded-2xl
                transition-all duration-300 border-2 overflow-hidden
                disabled:opacity-50 disabled:cursor-not-allowed
                ${isSelected 
                  ? `${option.color} shadow-lg shadow-${option.color.split('-')[1]}-500/20 scale-105 z-10` 
                  : 'bg-white border-transparent text-muted-foreground hover:bg-secondary hover:scale-105'
                }
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="energy-bg"
                  className="absolute inset-0 bg-white/40 pointer-events-none"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="text-3xl mb-2 relative z-10 block transition-transform group-hover:scale-110">
                {option.icon}
              </span>
              <span className="font-display font-bold text-sm relative z-10">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
