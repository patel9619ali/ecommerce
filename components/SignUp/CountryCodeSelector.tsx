"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { ChevronLeft, X } from "lucide-react"
import countries from "i18n-iso-countries";
import { getCountryCallingCode } from "libphonenumber-js";

type CountryCodeSelectorProps = {
    handleSelect: (code: string) => void;
    goBack: () => void;
};


countries.registerLocale(
    require("i18n-iso-countries/langs/en.json")
);

export const countryList = Object.entries(
    countries.getNames("en")
)
    .map(([iso, name]) => {
        try {
            const callingCode = getCountryCallingCode(iso as any);
            return {
                label: name,
                code: `+${callingCode}`,
            };
        } catch {
            return null;
        }
    })
    .filter(Boolean) as { label: string; code: string }[];

export default function CountryCodeSelector({ handleSelect, goBack }: CountryCodeSelectorProps) {

    const [searchQuery, setSearchQuery] = useState("");

    const filteredCountries = countryList.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.includes(searchQuery)
    );

    return (
        <>
            <div className="flex items-center gap-4 xs:px-0 px-0 pt-5 pb-3">
                <Button
                    onClick={goBack}
                    className="text-[#000000e6] bg-transparent hover:bg-transparent opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 !p-0">
                    <ChevronLeft className="!w-7 !h-7" />
                </Button>
                <h2 className="text-[#000000e6] text-lg font-semibold">
                    Your country code
                </h2>
            </div>

            {/* Search */}
            <div className="xs:px-6 px-0 pb-2 relative">
                <input
                    type="text"
                    placeholder="Search country code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-[44px] rounded-[16px] px-4 border border-[#C9C9C9] text-md text-[#000000e6] font-semibold placeholder:text-[#999999] outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 bg-white"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="text-[#000000e6] absolute right-8 top-[10px] cursor-pointer"
                    >
                        <X size={24} />
                    </button>
                )}
            </div>

            {/* Scrollable List */}
            <div className=" overflow-y-auto custom-scroll pb-[50px] !h-[350px]">
                <div className="pr-2">
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map(({ label, code }, index) => (
                            <button
                                key={index + code}
                                className="w-full text-left py-3 border-b border-[#C9C9C9] border-b-[1.5px] last:border-b-0 text-[#000000e6] text-[15px] font-semibold rounded-none cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0"
                                onClick={() => {
                                    handleSelect(code);
                                    goBack();
                                }}
                            >
                                {label} <span>({code})</span>
                            </button>
                        ))
                    ) : (
                        <p className="text-center py-4 text-[#999999]">
                            No results found
                        </p>
                    )}

                </div>
            </div>
        </>
    )
}