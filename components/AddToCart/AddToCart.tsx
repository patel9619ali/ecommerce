"use client"
import { useState } from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Minus,Plus } from 'lucide-react';
import { CartFooter } from './CartFooter';
type props = {
    sheetOpenCart: boolean;
    hasCartData: boolean;
    quantity: number;
    setQuantity: React.Dispatch<React.SetStateAction<number>>;
}
let TrashSVG = (
    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 16 16">
      <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
      <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
    </svg>
)
export function AddToCart({ sheetOpenCart,hasCartData, quantity, setQuantity }: props) {

   
     const incrementQuantity = () => {
       setQuantity(prev => prev + 1);
     };
   
     const decrementQuantity = () => {
       if (quantity > 0) {
         setQuantity(prev => prev - 1);
       }
     };
    const handleRemoveItem = () => {
        // Reset to 1 when removing item (or you could set to 0 and clear cart)
        setQuantity(0);
        // If you have a removeFromCart function in your CartContext, call it here
        // removeFromCart(itemId);
    };
  return (
 <>
 {hasCartData && 
    <>
        <SheetTitle className="hidden">Menu</SheetTitle>
        <SheetContent side="right" className="menu-sheet-hide-close lg:!max-w-[450px] md:!max-w-[350px] lg:w-[450px] md:w-[350px] justify-between w-full bg-black text-white border-white/10 duration-500 ease-out px-0">
        <div>
            <div className={`flex justify-between items-start relative pb-3 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[linear-gradient(325deg,#049cff_0%,#35ee7a_100%)] px-4`}>
                <div>
                    <p className='text-[16px] font-[700] uppercase mb-3'>Cart</p>
                    <p className='text-[12px] font-[600]'>You are eligible for free shipping.</p>
                </div>
                <SheetClose asChild>
                    <button className="cursor-pointer relative text-[#fff] opacity-70 hover:opacity-100">
                        <X fill="#fff40" size={30} className="bg-[#fafafa20] rounded-full p-1"/>
                    </button>
                </SheetClose>
            </div>
            {quantity > 0 &&
                <div className='mt-6'>
                    <div className='grid lg:grid-cols-[1fr_3fr] gap-2 px-4'>

                    <Image alt='' width={80} height={80} src={`/assets/images/dynasty-headphone-black-01.jpg`}/>
                    <div className='flex flex-col gap-3 items-start'>
                        <div className='flex gap-3 justify-between w-full'>
                            <div>
                                <h3 className='text-[14px] font-[700]'>DYNASTY HEADPHONE</h3>
                                <p className='text-[#fafafa8c] text-[12px]'>Color: Black</p>
                            </div>
                            <span className='text-[15px] font-[700]'>¥169,500</span>

                        </div>
                        <div className='flex w-full justify-between'>
                            {/* Increment counter */}
                            <div className='flex items-center border border-[#ffffff5c] rounded-md overflow-hidden'>
                                <button onClick={decrementQuantity} disabled={quantity <= 0} className='px-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed h-[30px]' aria-label="Decrease quantity" >
                                    <Minus size={10} />
                                </button>
                            
                                <span className='px-2  text-center font-semibold border-x border-[#ffffff5c]'>
                                    {quantity}
                                </span>
                            
                                <button onClick={incrementQuantity} className='px-2 transition-colors cursor-pointer h-[30px]' aria-label="Increase quantity" >
                                    <Plus size={10} />
                                </button>
                            </div>
                        
                            {/* Trash Icon */}
                            <button onClick={handleRemoveItem} className='cursor-pointer opacity-70 hover:opacity-100 transition-opacity'aria-label="Remove item">
                            {TrashSVG}
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            }
        </div>
        {quantity > 0 &&
            <CartFooter />
        }
        </SheetContent>
    </>
}   
</>
  )
}