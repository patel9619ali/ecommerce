'use client'
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { SpinnerCustom } from '@/components/Loader/SpinningLoader';
import { useLoading } from "@/context/LoadingContext"
export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState('Indian (INR ₹)');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const { setLoading } = useLoading()
  const currencyOptions = [
    { value: 'inr', label: 'Indian (INR ₹)' },
  ];

  // Sort currencies so selected one is always on top
  const sortedCurrencies = [...currencyOptions].sort((a, b) => {
    if (a.label === selectedCurrency) return -1;
    if (b.label === selectedCurrency) return 1;
    return 0;
  });

  const handleCurrencyChange = async (label: string) => {
    if (label === selectedCurrency) return

    setLoading(true)
    setIsOpen(false)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setSelectedCurrency(label)
    setLoading(false)
    }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger 
        className="lg:flex hidden cursor-pointer gap-2 items-center z-[1]"
        disabled={isLoading}
      >
        <svg stroke='#000' className='text-[#000]' xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" width={20} height={20} viewBox="0 0 24 24">
          <path d="m15 18 1-2-2.948-1.981-1.943-.124L10 15l2 3h3Z" stroke="currentColor" vectorEffect="non-scaling-stroke"></path>
          <path d="M12.904 2.04A9.993 9.993 0 0 0 2.039 12.903c.414 4.754 4.303 8.643 9.057 9.057a9.993 9.993 0 0 0 10.865-10.865c-.414-4.753-4.303-8.642-9.057-9.057Z" stroke="currentColor" vectorEffect="non-scaling-stroke"></path>
          <path d="M3 7.46 7.75 11l1.178-2.324 4.686-1.17L15 2" stroke="currentColor" vectorEffect="non-scaling-stroke"></path>
        </svg>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <SpinnerCustom />
            <span className="text-[14px] font-[600] text-[#fff]">
              Loading...
            </span>
          </div>
        ) : (
          <span className="text-[14px] font-[600] text-[#000]">
            {selectedCurrency}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="shadow-[0px_4px_12px_0px_rgba(102,102,102,0.25)] border border-[#000] bg-[#000] px-2 py-2 mt-0 w-auto"
        align="center"
      >
        {sortedCurrencies.map((option) => (
          <div 
            key={option.value} 
            onClick={() => handleCurrencyChange(option.label)}
            className={cn(
              "flex items-center px-3 py-2 cursor-pointer rounded-md transition-colors  last:border-b-0",
              selectedCurrency === option.label 
                ? "bg-transparent cursor-not-allowed opacity-60" 
                : "hover:bg-transparent"
            )}
          >
            <Label 
              className={cn(
                "font-[600] text-[12px] leading-[24px] uppercase cursor-pointer",
                selectedCurrency === option.label 
                  ? "text-[#fff]/60 cursor-not-allowed" 
                  : "text-[#fff]"
              )}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}