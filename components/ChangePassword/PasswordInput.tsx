import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const PasswordInput = ({ id, placeholder, value, onChange, className }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${className} text-[#000]`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-[#6c7993] hover:text-[#091434] transition-colors"
      >
        {showPassword ? <EyeOff className="cursor-pointer h-5 w-5" /> : <Eye className="cursor-pointer h-5 w-5" />}
      </button>
    </div>
  );
};

export default PasswordInput;
