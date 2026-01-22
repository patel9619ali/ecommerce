import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
interface AuthCardProps {
  children: ReactNode;
  title: string;
  description?: string;
  icon?: ReactNode;
}

export const AuthCard = ({ children, title, description, icon }: AuthCardProps) => {
  return (
    <Card className="bg-white p-6 rounded-md w-full max-w-sm shadow space-y-4">
      <CardHeader className="space-y-1 text-center">
        {icon && (
          <div className="dark:text-[#000000] text-[#000000] mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--auth-gradient-start))] to-[hsl(var(--auth-gradient-end))]">
            {icon}
          </div>
        )}
        <CardTitle className="dark:text-[#000000] text-[#000000] text-2xl font-semibold tracking-tight">{title}</CardTitle>
        {description && (
          <CardDescription className="dark:text-[#000000] text-[#000000]">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
