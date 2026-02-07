"use client"
import { useRouter} from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';
import { Minus,Plus } from 'lucide-react';
import { CartFooter } from './CartFooter';
import { useHydrated } from "@/hooks/useHydrated";
let TrashSVG = (
    <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" fill="none" viewBox="0 0 16 16">
      <path d="M14 3h-3.53a3.07 3.07 0 00-.6-1.65C9.44.82 8.8.5 8 .5s-1.44.32-1.87.85A3.06 3.06 0 005.53 3H2a.5.5 0 000 1h1.25v10c0 .28.22.5.5.5h8.5a.5.5 0 00.5-.5V4H14a.5.5 0 000-1zM6.91 1.98c.23-.29.58-.48 1.09-.48s.85.19 1.09.48c.2.24.3.6.36 1.02h-2.9c.05-.42.17-.78.36-1.02zm4.84 11.52h-7.5V4h7.5v9.5z" fill="currentColor"></path>
      <path d="M6.55 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5zM9.45 5.25a.5.5 0 00-.5.5v6a.5.5 0 001 0v-6a.5.5 0 00-.5-.5z" fill="currentColor"></path>
    </svg>
)
export function AddToCart() {
  const { items, isCartOpen, closeCart,updateQuantity, removeItem } = useCartStore();
  const router = useRouter();
  const hydrated = useHydrated();

if (!hydrated) return null;
  
  const item = items[0]; // single-product store
  if (!item) return null;
  const getImageSrc = (image?: string) => {
  if (!image) return "/placeholder.png";

  // Already absolute (http or https)
  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  // Relative path → prepend CMS URL
  return `${process.env.NEXT_PUBLIC_CMS_URL}${image}`;
};
  return (
 <>

    <Sheet open={isCartOpen} onOpenChange={(open) => { if (!open) closeCart(); }} >
        <SheetTitle className="hidden">Menu</SheetTitle>
        <SheetContent side="right" className="menu-sheet-hide-close lg:!max-w-[450px] md:!max-w-[350px] lg:w-[450px] md:w-[350px] justify-between w-full bg-black text-white border-white/10 duration-500 ease-out px-0">
            <div className={`flex justify-between items-start relative pb-3 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[linear-gradient(325deg,#049cff_0%,#35ee7a_100%)] px-4 `}>
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
        <div className="h-screen overflow-y-auto custom-scroll pb-[150px]">
            <div className='mt-6 overflow-y-auto'>

                {items.map((item,index) => (
                    <Link href={`/products/${item?.slug}?variant=${item?.variantKey}&editCart=true`} key={`${item.title}-${index}`} onClick={() => closeCart()} className='grid grid-cols-[1fr_3fr] gap-2 mx-4 first:pt-0 pt-5 pb-5 last:pb-0 last:border-0 border-b border-[#ffffff4f]'>
                        <div className="lg:w-[120px] xs:w-[120px] w-[100px]">
                        <Image src={getImageSrc(item.image)} alt={item?.title || "Product image"} width={120} height={120} className="object-cover rounded-md" />

                        </div>
                    <div className='flex flex-col gap-3 items-start mb-5'>
                        <div className="flex gap-3 justify-between w-full">
                            <div>
                                <h3 className='lg:text-[14px] text-[12px] font-[700]'>{item.title}</h3>
                                <p className='text-[#fafafa8c] lg:text-[12px] text-[10px]'>Variant: {item.variantKey}</p>
                            </div>
                            <span className='lg:text-[15px] flex gap-2 text-[12px] font-[700]'><span>₹</span><span>{item.price}</span> </span>
                        </div>
                        <div className='flex w-full justify-between'>
                            {/* Increment counter */}
                            <div className='flex items-center border border-[#ffffff5c] rounded-md overflow-hidden'>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateQuantity(item.id, Math.max(1, item.quantity - 1));
                                }}  className='px-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed lg:h-[30px] h-[25px]'>
                                    <Minus size={10} />
                                </button>

                                <span className='px-2 text-center lg:text-[17px] text-[14px] font-semibold border-x border-[#ffffff5c]'>{item.quantity}</span>

                                <button onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    updateQuantity(item.id, item.quantity + 1);
                                }}  className='px-2 transition-colors cursor-pointer lg:h-[30px] h-[25px]' aria-label="Increase quantity">
                                    <Plus size={10} />
                                </button>
                            </div>

                            <button onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeItem(item.id);
                            }} className='cursor-pointer opacity-70 hover:opacity-100 transition-opacity' aria-label="Remove item">
                            {TrashSVG}
                            </button>
                        </div>
                    </div>
                </Link >
            ))}
            </div>
          
        </div>
        <CartFooter onCheckout={() => { closeCart(); router.push("/checkout"); }} />
        </SheetContent>
    </Sheet>
</>
  )
}