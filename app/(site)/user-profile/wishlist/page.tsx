"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import LoadingLink from "@/components/Loader/LoadingLink";
import { useWishlistStore } from "@/store/useWishListStore";
import { useCartStore } from "@/store/useCartStore";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/UserProfile/Sidebar";

const sidebarItems = [
  { label: "My Profile", icon: User, href: "/user-profile/profile", active: false },
  { label: "My Wishlist", icon: Heart, href: "/user-profile/wishlist", active: true },
];

export default function WishlistPage() {
  const router = useRouter();
  const user = useCurrentUser();
  const { items, removeItem, loadFromDatabase, hydrated } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  // Load wishlist when user logs in
  useEffect(() => {
    if (user?.id) {
      loadFromDatabase(user.id);
    }
  }, [user?.id, loadFromDatabase]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/sign-in?callbackUrl=/user-profile/wishlist");
    }
  }, [user, router]);

  const handleAddToCart = (item: any) => {
    addToCart({
      id: `${item.productId}-${item.variantId}`,
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      price: item.price,
      mrp: item.mrp,
      variantKey: item.variantId,
      image: item.image,
      quantity: 1,
    }, true);
  };

  if (!user) return null;

  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] min-h-screen">
      <div className="container px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <LoadingLink href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> HOME
          </LoadingLink>
          <span className="text-foreground font-medium">MY WISHLIST</span>
        </nav>

        <div className="grid md:grid-cols-[1fr_3fr] grid-cols-1 xl:gap-6 lg:gap-4 md:gap-5">
            <Sidebar/>
          {/* Wishlist Content */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Wishlist</h2>
                <p className="text-sm text-muted-foreground">
                  {items.length} item{items.length !== 1 ? "s" : ""} saved
                </p>
              </div>
            </div>

            {!hydrated ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : items.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">Save items you love to your wishlist</p>
                <Button asChild className="bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)] text-white rounded-xl">
                  <LoadingLink href="/">Browse Products</LoadingLink>
                </Button>
              </motion.div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className="border-0 shadow-sm group overflow-hidden hover:shadow-md transition-shadow py-0">
                        <CardContent className="p-0">
                          <div className="aspect-square bg-muted/50 flex items-center justify-center relative">
                            <img
                              src={`${process.env.NEXT_PUBLIC_CMS_URL}${item.image}`}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="cursor-pointer absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff0000] hover:text-white"
                            >
                              <Trash2 className="h-4 w-4 group-hover:text-[#fff]" />
                            </button>
                            {item.colorHex && (
                              <div 
                                className="absolute top-3 left-3 h-4 w-4 rounded-full border-2 border-white shadow-sm" 
                                style={{ backgroundColor: item.colorHex }} 
                              />
                            )}
                          </div>
                          <div className="p-4 bg-[#fff]">
                            <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-[#000]">{item.title}</h3>
                            {item.colorName && (
                              <p className="text-xs text-[#6f6f7b] mb-2">{item.colorName}</p>
                            )}
                            <div className="flex items-baseline gap-2 mb-3">
                              <span className="font-bold">₹{item.price.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{item.mrp.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="cursor-pointer flex-1 bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)] text-white rounded-lg text-xs h-9"
                                onClick={() => handleAddToCart(item)}
                              >
                                <ShoppingCart className="h-3.5 w-3.5 mr-1" /> Add to Cart
                              </Button>
                              <Button size="sm" variant="outline" asChild className="rounded-lg text-xs h-9 hover:bg-[linear-gradient(135deg,hsl(252,80%,60%),hsl(16,90%,58%))] shadow-[0_4px_12px_-2px_rgba(104,71,235,0.3)] hover:text-[#fff]">
                                <LoadingLink href={`/products/${item.slug}?variant=${item.variantId}`}>
                                  View
                                </LoadingLink>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}