import { AlertCircle } from "lucide-react";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-red-100 p-3 text-sm text-red-700">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
