"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ShippingForm() {
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  return (
    <div className="pb-5 px-5">
      <p className='text-[14px] mb-4 text-left font-[500] text-[#fff]'>Shipping address</p>
      <Card className="bg-[#0a0a0a] border-white/10">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            {/* Country/Region */}
            <div className="grid gap-2">
              <Label htmlFor="country" className="text-white text-sm font-medium">Country/Region</Label>
              <Select defaultValue="india">
                <SelectTrigger id="country" className="bg-transparent border-white/20 text-white">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Full Name */}
            <div className="grid gap-2">
              <Label htmlFor="fullname" className="text-white text-sm font-medium">
                Full name (First and Last name)
              </Label>
              <Input 
                id="fullname" 
                placeholder="" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Mobile Number */}
            <div className="grid gap-2">
              <Label htmlFor="mobile" className="text-white text-sm font-medium">Mobile number</Label>
              <Input 
                id="mobile" 
                placeholder="" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
              <p className="text-xs text-white/60">May be used to assist delivery</p>
            </div>

            {/* Pincode */}
            <div className="grid gap-2">
              <Label htmlFor="pincode" className="text-white text-sm font-medium">Pincode</Label>
              <Input 
                id="pincode" 
                placeholder="6 digits [0-9] PIN code" 
                maxLength={6}
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Flat, House no., Building */}
            <div className="grid gap-2">
              <Label htmlFor="flat" className="text-white text-sm font-medium">
                Flat, House no., Building, Company, Apartment
              </Label>
              <Input 
                id="flat" 
                placeholder="" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Area, Street, Sector, Village */}
            <div className="grid gap-2">
              <Label htmlFor="area" className="text-white text-sm font-medium">
                Area, Street, Sector, Village
              </Label>
              <Input 
                id="area" 
                placeholder="" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Landmark */}
            <div className="grid gap-2">
              <Label htmlFor="landmark" className="text-white text-sm font-medium">Landmark</Label>
              <Input 
                id="landmark" 
                placeholder="E.g. near apollo hospital" 
                className="bg-transparent border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {/* Town/City and State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city" className="text-white text-sm font-medium">Town/City</Label>
                <Input 
                  id="city" 
                  placeholder="" 
                  className="bg-transparent border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state" className="text-white text-sm font-medium">State</Label>
                <Select>
                  <SelectTrigger id="state" className="bg-transparent border-white/20 text-white">
                    <SelectValue placeholder="Choose a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="flex items-start gap-2 mt-2">
              <Checkbox id="default-address" className="mt-0.5 border-white/20" />
              <Label 
                htmlFor="default-address" 
                className="text-white text-sm font-normal leading-tight cursor-pointer"
              >
                Make this my default address
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
      <Button className='mt-4 uppercase bg-[#fff] hover:bg-[#f0f0f0] px-4 font-[700] w-full text-[#000000f0] text-[14px]'>
        SAVE ADDRESS
      </Button>
    </div>
  );
}