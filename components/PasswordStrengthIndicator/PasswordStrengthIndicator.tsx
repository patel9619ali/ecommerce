import { useMemo } from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

type StrengthLevel = "weak" | "medium" | "strong" | "very-strong";

const getPasswordStrength = (password: string): { level: StrengthLevel; score: number; label: string } => {
  if (!password) return { level: "weak", score: 0, label: "" };

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character type checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { level: "weak", score: 1, label: "Weak password" };
  if (score <= 3) return { level: "medium", score: 2, label: "Medium password" };
  if (score <= 4) return { level: "strong", score: 3, label: "Strong password" };
  return { level: "very-strong", score: 4, label: "Very strong password" };
};

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const { level, score, label } = useMemo(() => getPasswordStrength(password), [password]);

  if (!password) return null;

  const getSegmentColor = (index: number) => {
    if (index >= score) return "bg-white/60";
    
    switch (level) {
      case "weak":
        return "bg-[#ef4343]";
      case "medium":
        return "bg-[#f59f0a]";
      case "strong":
      case "very-strong":
        return "bg-[#21c45d]";
      default:
        return "bg-white/60";
    }
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${getSegmentColor(index)}`}
          />
        ))}
      </div>
      <p className="text-xs text-[#64748b]">Level: {label}</p>
    </div>
  );
};
