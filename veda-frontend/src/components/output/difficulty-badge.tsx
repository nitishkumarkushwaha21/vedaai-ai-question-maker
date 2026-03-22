import type { Difficulty } from "@/types/question-paper";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
  variant?: "color" | "text";
};

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-rose-100 text-rose-800",
};

export function DifficultyBadge({ difficulty, variant = "color" }: DifficultyBadgeProps) {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  if (variant === "text") {
    return <span className="difficulty-text inline-flex items-center align-middle text-xs font-medium leading-none text-slate-700">({label})</span>;
  }

  return (
    <span className={`difficulty-chip inline-flex items-center align-middle rounded-full px-2 py-[3px] text-xs font-medium leading-none ${DIFFICULTY_CLASSES[difficulty]}`}>
      {label}
    </span>
  );
}