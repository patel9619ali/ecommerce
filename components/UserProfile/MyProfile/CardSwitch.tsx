"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type CardSwitchProps = {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
};

export function CardSwitch({
  id,
  label,
  checked,
  disabled,
  onChange,
  icon,
}: CardSwitchProps) {
  return (
    <div
      className={`
        relative flex items-start gap-1 transition-all duration-200
        
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={() => !disabled && onChange(!checked)}
    >
      {/* Icon */}
      {icon && (
        <div className="shrink-0 text-[#053E54]">
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex grow items-center justify-between gap-2">
        <div className="grid gap-1">
          <Label
            htmlFor={id}
            className="text-[14px] font-semibold text-[#053E54] cursor-pointer"
          >
            {label}
          </Label>
        </div>

        {/* Switch */}
        <Switch
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onChange}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full
            transition-colors duration-200 ease-in-out
            ${checked ? 'bg-[#057C72]' : 'bg-[#C9C9C9]'}
            ${disabled ? 'cursor-not-allowed' : ''}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#057C72] focus-visible:ring-offset-2
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full
              bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-6' : 'translate-x-0.5'}
            `}
          />
        </Switch>
      </div>
    </div>
  );
}