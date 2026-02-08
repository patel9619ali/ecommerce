export default function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-pulse">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-[hsl(240_10%_90%/0.6)]"
          />
        ))}
      </div>

      <div className="h-64 rounded-2xl bg-[hsl(240_10%_90%/0.6)]" />
    </div>
  );
}
