'use client';

import { useState } from "react";
import { X } from "lucide-react";

export default function SearchFunctionalityFAQ({
  className,
  onSearch,
}: {
  className?: string;
  onSearch: (value: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={`relative max-w-2xl m-auto lg:!mb-15 !mb-10 ${className}`}>

      {/* LEFT SEARCH ICON (only when empty) */}
      {query.length === 0 && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
            <path
              d="M16.6194 16.5708C15.8482 17.342 14.825 17.7661 13.7339 17.7661C12.6428 17.7661 11.6196 17.342 10.8484 16.5708C10.0772 15.8005 9.65397 14.7764 9.65397 13.6862C9.65397 12.596 10.0781 11.5719 10.8484 10.8007C11.6196 10.0295 12.6428 9.60534 13.7339 9.60534C14.825 9.60534 15.8482 10.0295 16.6194 10.8007C17.3906 11.571 17.8138 12.596 17.8138 13.6862C17.8138 14.7764 17.3906 15.8005 16.6194 16.5708ZM28.9453 14.5C28.9453 22.4949 22.4403 29 14.4453 29C6.45038 29 -0.0546875 22.4949 -0.0546875 14.5C-0.0546875 6.50506 6.45038 0 14.4453 0C22.4403 0 28.9453 6.50416 28.9453 14.5ZM20.8969 19.546L18.499 17.1417C19.2276 16.1421 19.6263 14.9459 19.6263 13.6853C19.6263 12.1111 19.0137 10.6312 17.9008 9.51834C16.788 8.40547 15.309 7.79194 13.7339 7.79194C12.1588 7.79194 10.6798 8.40547 9.56697 9.51834C8.45409 10.6312 7.84147 12.1111 7.84147 13.6853C7.84147 15.2594 8.455 16.7393 9.56697 17.8513C10.6798 18.9642 12.1588 19.5777 13.7339 19.5777C15.0072 19.5777 16.2161 19.1699 17.2221 18.4268L19.6137 20.8247C19.7904 21.0023 20.0224 21.0912 20.2553 21.0912C20.4873 21.0912 20.7184 21.0033 20.8951 20.8265C21.2494 20.4749 21.2494 19.9003 20.8969 19.546Z"
              fill="#053E54"
            />
          </svg>
        </span>
      )}

      {/* INPUT FIELD */}
      <input
        type="text"
        value={query}
        placeholder="Search FAQs"
        onChange={handleChange}
        className={` w-full  rounded-[20px] bg-white  lg:px-4 lg:py-4 px-4 py-2 outline-none border transition-all placeholder:text-[#C9C9C9] placeholder:lg:text-[19px] placeholder:text-[14px] placeholder:font-[600] text-[#053E54] lg:text-[19px] text-[14px] font-[600]
          ${query.length > 0 ? "border-[#053E54]" : "border-[#C9C9C9]"}
        `}
      />

      {/* CLEAR BUTTON (only when typing) */}
      {query.length > 0 && (
        <button
          onClick={clearSearch} className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2" >
          <X size={26} stroke="#053E54" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
