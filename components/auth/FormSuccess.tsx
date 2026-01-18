import { CheckCircle } from "lucide-react";

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-green-100 p-3 text-sm text-green-700">
      <CheckCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
