import { cn } from "@/lib/utils";

export function SpinnerCustom({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Outer ring */}
      <div className="relative h-16 w-16">
        {/* Gradient spinning ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent" 
          style={{
            borderTopColor: 'hsl(330 80% 55%)',
            borderRightColor: 'hsl(145 65% 45%)',
            animationDuration: '1s',
          }}
        />
        {/* Inner counter-spinning ring */}
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: 'hsl(270 70% 55%)',
            borderLeftColor: 'hsl(330 80% 55%)',
            animationDuration: '1.5s',
            animationDirection: 'reverse',
          }}
        />
        {/* Center pulse dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full animate-pulse"
            style={{ background: 'linear-gradient(135deg, hsl(330 80% 55%), hsl(270 70% 55%))' }}
          />
        </div>
      </div>
      <p className="text-[16px] font-medium text-[#fff] animate-pulse">Loading...</p>
    </div>
  );
}
