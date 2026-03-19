import type { Difficulty } from "@/types/question-paper";

type DifficultyBadgeProps = {
  difficulty: Difficulty;
};

const DIFFICULTY_CLASSES: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  hard: "bg-rose-100 text-rose-800",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${DIFFICULTY_CLASSES[difficulty]}`}>
      {difficulty}
    </span>
  );
}