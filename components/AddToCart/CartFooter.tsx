"use client"
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ShippingForm } from '@/components/ShippingAddress/ShippingAddress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { useCartStore } from "@/store/useCartStore";
let NoteSVG = (
    <svg width={15} height={15} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 512 512">
      <path fillRule="evenodd" clipRule="evenodd" d="M493.25 56.26l-37.51-37.51C443.25 6.25 426.87 0 410.49 0s-32.76 6.25-45.26 18.74L12.85 371.12.15 485.34C-1.45 499.72 9.88 512 23.95 512c.89 0 1.78-.05 2.69-.15l114.14-12.61 352.48-352.48c24.99-24.99 24.99-65.51-.01-90.5zM126.09 468.68l-93.03 10.31 10.36-93.17 263.89-263.89 82.77 82.77-263.99 263.98zm344.54-344.54l-57.93 57.93-82.77-82.77 57.93-57.93c6.04-6.04 14.08-9.37 22.63-9.37 8.55 0 16.58 3.33 22.63 9.37l37.51 37.51c12.47 12.48 12.47 32.78 0 45.26z" fill="currentColor"></path>
    </svg>
)
let Shipping = (
    <svg width={15} height={15} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 640 512">
      <path d="M280 192c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240zm352 192h-24V275.9c0-16.8-6.8-33.3-18.8-45.2l-83.9-83.9c-11.8-12-28.3-18.8-45.2-18.8H416V78.6c0-25.7-22.2-46.6-49.4-46.6H113.4C86.2 32 64 52.9 64 78.6V96H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H96V78.6c0-8.1 7.8-14.6 17.4-14.6h253.2c9.6 0 17.4 6.5 17.4 14.6V384H207.6C193 364.7 170 352 144 352c-18.1 0-34.6 6.2-48 16.4V288H64v144c0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16h195.2c-1.1 5.2-1.6 10.5-1.6 16 0 44.2 35.8 80 80 80s80-35.8 80-80c0-5.5-.6-10.8-1.6-16H632c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8zm-488 96c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm272-320h44.1c8.4 0 16.7 3.4 22.6 9.4l83.9 83.9c.8.8 1.1 1.9 1.8 2.8H416V160zm80 320c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-96h-16.4C545 364.7 522 352 496 352s-49 12.7-63.6 32H416v-96h160v96zM256 248v-16c0-4.4-3.6-8-8-8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8z" fill="currentColor"></path>
    </svg>
)
let Discount = (
    <svg width={15} height={15} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm2.828 8.486a2 2 0 1 0 2.828-2.829 2 2 0 0 0-2.828 2.829z" fill="currentColor"></path>
    </svg>
)
export function CartFooter({ onCheckout }: { onCheckout: () => void }) {
    const STATES_WITH_CITIES: Record<string, string[]> = {
        Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
        Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
        Delhi: ["New Delhi"],
        Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    };
    const [sheetNoteOpen, setSheetNoteOpen] = useState(false);
    const [sheetShippingOpen, setSheetShippingOpen] = useState(false);
    const [sheetDiscountOpen, setSheetDiscountOpen] = useState(false);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const findStateByCity = (city: string) => {
        return Object.keys(STATES_WITH_CITIES).find((state) =>
            STATES_WITH_CITIES[state].includes(city)
        );
    };
  const { items } = useCartStore();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  return (
        <>
            <div className='sticky bottom-[0]'>
                <div className='flex flex-col gap-3 items-center mt-5 justify-between'>
                    <div className="flex items-center mt-5 justify-center border-y border-[#ffffff5c] py-2 px-4 divide-x divide-[#ffffff5c] w-full">
                        <button onClick={() => setSheetNoteOpen(true)} className="cursor-pointer flex items-center gap-2 text-white lg:px-6 px-4" >
                            {NoteSVG}
                            <span className="text-[14px] uppercase">Note</span>
                        </button>
                        <button onClick={() => setSheetShippingOpen(true)} className="cursor-pointer flex items-center gap-2 text-white lg:px-6 px-4" >
                            {Shipping}
                            <span className="text-[14px] uppercase">Shipping</span>
                        </button>
                        <button onClick={() => setSheetDiscountOpen(true)} className="cursor-pointer flex items-center gap-2 text-white lg:px-6 px-4" >
                            {Discount}
                            <span className="text-[14px] uppercase">Discount</span>
                        </button>
                    </div>


                    {/* Overlay */}
                    {sheetNoteOpen && (
                        <div onClick={() => setSheetNoteOpen(false)} className="fixed z-40 inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] transition-opacity" />
                    )}
                    {sheetShippingOpen && (
                        <div onClick={() => setSheetShippingOpen(false)} className="fixed z-40 inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] transition-opacity" />
                    )}
                    {sheetDiscountOpen && (
                        <div onClick={() => setSheetDiscountOpen(false)} className="fixed z-40 inset-0 z-50 bg-black/30 [backdrop-filter:blur(4px)] transition-opacity" />
                    )}

                    {/* Bottom Sheet */}
                    <div className={`fixed right-0 bottom-0 z-50 lg:max-w-[450px] md:max-w-[350px] w-full bg-[#000000] text-white transition-transform duration-500 ease-out border border-white/10 ${sheetNoteOpen ? 'translate-y-0' : 'translate-y-full'} `} >
                        {/* Header */}
                        <div className="flex justify-end p-3 mb-4">
                            <button className="absolute opacity-70 hover:opacity-100 cursor-pointer " onClick={() => setSheetNoteOpen(false)}>
                                <X size={28} className="bg-white/10 rounded-full p-1" />
                            </button>
                            {/* Content */}
                        </div>
                        <div className="pb-5 px-5 text-center">
                            <p className='text-[14px] mb-3 text-left font-[500] text-[#fff]'>Order instructions, gift messages, or special notes for the seller.</p>
                            <textarea placeholder="Put your message here" className="w-full border border-[#ffffff5c] rounded-[0] px-4 py-3 outline-none text-[#fff] placeholder:text-[#ffffff5c] font-medium focus-visible:border-[#ffffff5c] focus-visible:border-[1.5px]" />
                            <Button className='mt-4 uppercase bg-[#fff] px-4 font-[700] w-[250px] text-[#000000f0] text-[14px]'>SUBMIT</Button>
                        </div>
                    

                    </div>
                    <div className={`fixed right-0 bottom-0 z-50 lg:max-w-[450px] md:max-w-[350px] w-full bg-[#000000] text-white transition-transform duration-500 ease-out border border-white/10 ${sheetShippingOpen ? 'translate-y-0' : 'translate-y-full'} `} >
                        {/* Header */}
                        <div className="flex justify-end p-3 mb-5">
                            <button onClick={() => setSheetShippingOpen(false)} className="absolute opacity-70 hover:opacity-100 cursor-pointer" >
                                <X size={28} className="bg-white/10 rounded-full p-1" />
                            </button>
                            {/* Content */}
                        </div>
                        <div className="grid grid-cols-1 gap-2 pb-5 px-5 text-center">
                            <div className="grid gap-2 mb-3">
                                <Input id="flat" placeholder="Flat, House no., Building, Company, Apartment" className="bg-transparent w-full border border-[#ffffff5c] rounded-[0] px-4 py-3 mt-2 outline-none text-[#fff] placeholder:text-[#ffffff5c] font-medium focus-visible:!border-[#ffffff5c] focus-visible:!ring-[0px] focus-visible:!border-[1.5px]" />
                            </div>
                            <div className="grid gap-2 mb-3">
                                <Input id="area" placeholder="Area, Street, Sector, Village" className="bg-transparent w-full border border-[#ffffff5c] rounded-[0] px-4 py-3 outline-none text-[#fff] placeholder:text-[#ffffff5c] font-medium focus-visible:!border-[#ffffff5c] focus-visible:!ring-[0px] focus-visible:!border-[1.5px]"/>
                            </div>
                            <div className="grid gap-2 mb-3">
                                <Input type='number' id="pincode" placeholder="6 digits [0-9] PIN code" maxLength={6} className="bg-transparent w-full border border-[#ffffff5c] rounded-[0] px-4 py-3 outline-none text-[#fff] placeholder:text-[#ffffff5c] font-medium focus-visible:!border-[#ffffff5c] focus-visible:!ring-[0px] focus-visible:!border-[1.5px]"/>
                            </div>
                            <div className="grid gap-2 w-full mb-3">
                                <Select value={selectedState ?? undefined} onValueChange={(state) => { setSelectedState(state); setSelectedCity(null);  }} >
                                    <SelectTrigger className="w-full bg-transparent border-white/20 text-white">
                                        <SelectValue placeholder="Choose a state" />
                                    </SelectTrigger>

                                    <SelectContent className="bg-white">
                                        {Object.keys(STATES_WITH_CITIES).map((state) => (
                                        <SelectItem key={state} value={state}>
                                            {state}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2 w-full mb-3">
                                <Select key={selectedState ?? "no-state"}
                                    value={selectedCity ?? undefined}
                                    onValueChange={(city) => {
                                        setSelectedCity(city);

                                        if (!selectedState) {
                                        const detectedState = findStateByCity(city);
                                        if (detectedState) setSelectedState(detectedState);
                                        }
                                    }}
                                    >
                                    <SelectTrigger className="w-full bg-transparent border-white/20 text-white">
                                        <SelectValue placeholder="Choose a city" />
                                    </SelectTrigger>

                                        <SelectContent className="bg-white">
                                            {(selectedState
                                            ? STATES_WITH_CITIES[selectedState]
                                            : Object.values(STATES_WITH_CITIES).flat()
                                            ).map((city) => (
                                            <SelectItem key={city} value={city}>
                                                {city}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                            </div>
                            <div className="flex items-start gap-2 mt-2">
                                <Checkbox id="default-address" className="mt-0.5 border-white/20" />
                                <Label 
                                    htmlFor="default-address" 
                                    className="text-white text-sm font-normal leading-tight cursor-pointer" >
                                    Make this my default address
                                </Label>
                            </div>
                            <Button className='mt-4 uppercase bg-[#fff] hover:bg-[#f0f0f0] px-4 font-[700] w-full text-[#000000f0] text-[14px]'>
                                SAVE ADDRESS
                            </Button>
                        </div>

                    </div>
                    <div className={`fixed right-0 bottom-0 z-50 lg:max-w-[450px] md:max-w-[350px] w-full bg-[#000000] text-white transition-transform duration-500 ease-out border border-white/10 ${sheetDiscountOpen ? 'translate-y-0' : 'translate-y-full'} `} >
                        {/* Header */}
                        <div className="flex justify-end p-3">
                            <button onClick={() => setSheetDiscountOpen(false)} className="absolute opacity-70 hover:opacity-100" >
                                <X size={28} className="bg-white/10 rounded-full p-1" />
                            </button>
                            {/* Content */}
                        </div>
                        <div className="pb-5 px-5">
                            Apply Coupen Code
                            <div className="flex gap-2 mt-3 mb-5">
                                <Input placeholder="Enter your code" className="bg-transparent w-full border border-[#ffffff5c] rounded-[0] px-4 py-3 outline-none text-[#fff] placeholder:text-[#ffffff5c] font-medium focus-visible:!border-[#ffffff5c] focus-visible:!ring-[0px] focus-visible:!border-[1.5px]" />
                                <Button className='uppercase bg-[#fff] px-4 font-[700] w-[100px] text-[#000000f0] text-[14px]'>APPLY</Button>
                                </div>
                        </div>

                    </div>

                    <p className='text-[13px] text-left font-[500] text-[#fff]'>Taxes, discounts and shipping calculated at checkout.</p>
                    <Button onClick={onCheckout} className='cursor-pointer uppercase bg-[#fff] px-4 font-[700] w-[250px] text-[#000000f0] text-[14px]'>Check out - ₹ {total}</Button>
                </div>
            </div>
        </>
    )
}
