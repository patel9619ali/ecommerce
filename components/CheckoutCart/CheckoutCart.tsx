// components/CheckoutCart/CheckoutCart.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  CreditCard,
  Wallet,
  Building2,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronDown,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CartProduct, useCartStore } from "@/store/useCartStore";
import MobileCheckoutBar from "../Cart/MobileCheckoutBar";
import { useLoading } from "@/context/LoadingContext";
import { toast } from "sonner";

interface CheckoutCartProps {
  items: CartProduct[];
  total: number;
  itemCount: number;
}

const CheckoutCart = ({ items, total: totalProp, itemCount }: CheckoutCartProps) => {
  const { setLoading } = useLoading();
  const router = useRouter();
  const { resetCart } = useCartStore();
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false);
  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [apartment, setApartment] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("");
  const [addressOpen, setAddressOpen] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [addressSaved, setAddressSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
  const shipping = 0;
  const tax = subtotal * 0.08;
  const codCharge = paymentMethod === "cod" ? 30 : 0;
  const total = subtotal + shipping + tax + codCharge;

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await fetch("/api/address");
        const data = await res.json();

        if (data.addresses?.[0]) {
          const addr = data.addresses[0];
          setFirstName(addr.firstName);
          setLastName(addr.lastName);
          setPhone(addr.phone);
          setAddress(addr.address);
          setBuilding(addr.building || "");
          setApartment(addr.apartment || "");
          setLandmark(addr.landmark || "");
          setCity(addr.city);
          setState(addr.state);
          setPincode(addr.pincode);
          setSavedAddressId(addr.id);
          setAddressSaved(true);
          setAddressOpen(false);
        }
      } catch (error) {
        console.error("Failed to load address:", error);
      }
    };

    fetchAddress();
  }, []);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setAppliedCoupon(couponCode);
      toast.success("Coupon applied! You save ₹" + discount);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const validateAddress = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName || firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    if (!lastName || lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!address || address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }
    if (!city || city.length < 2) {
      newErrors.city = "City is required";
    }
    if (!state || state.length < 2) {
      newErrors.state = "State is required";
    }
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "PIN code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (
    field: keyof typeof errors,
    value: string,
    setter: (v: string) => void
  ) => {
    setter(value);

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (hasAttemptedSave) {
      setTimeout(() => validateAddress(), 0);
    }
  };

  const handleSaveAddress = async () => {
    setHasAttemptedSave(true);

    if (!validateAddress()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          address,
          building,
          apartment,
          landmark,
          city,
          state,
          pincode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      setAddressSaved(true);
      setAddressOpen(false);
      setSavedAddressId(data.address.id);
      toast.success("Address saved successfully!");
    } catch (error: any) {
      console.error("Address save error:", error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!addressSaved) {
      toast.error("Please save your address first");
      setAddressOpen(true);
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setLoading(true);

      // ✅ COD Flow
      if (paymentMethod === "cod") {
        const orderRes = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              variantKey: item.variantKey,
              title: item.title,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            total,
            paymentMethod: "cod",
          }),
        });

        const data = await orderRes.json();
        if (!orderRes.ok) throw new Error(data.error || "Failed to create order");

        // ✅ CHANGED: localStorage instead of sessionStorage (persists across Razorpay redirect)
        localStorage.setItem("lastOrder", JSON.stringify(data.order));
        router.replace(`/order-confirmation/${data.order.id}`);

        setTimeout(() => {
          fetch("/api/cart/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [] }),
          }).catch(console.error);
          localStorage.removeItem("cart-storage");
        }, 1000);

        return;
      }

      // ✅ Razorpay Flow
      if (paymentMethod === "razorpay") {
        await loadRazorpay();

        const paymentRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });

        const paymentData = await paymentRes.json();
        if (!paymentRes.ok) throw new Error("Failed to initialize payment");

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: paymentData.order.amount,
          currency: "INR",
          name: "BlendRas",
          description: "Order Payment",
          order_id: paymentData.order.id,

          handler: async function (response: any) {
            try {
              const orderRes = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: items.map((item) => ({
                    productId: item.productId,
                    variantKey: item.variantKey,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                  })),
                  total,
                  paymentMethod: "razorpay",
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                }),
              });

              const data = await orderRes.json();
              if (!orderRes.ok) throw new Error(data.error || "Failed to create order");

              // ✅ CHANGED: localStorage instead of sessionStorage (persists across Razorpay redirect)
              localStorage.setItem("lastOrder", JSON.stringify(data.order));
              router.replace(`/order-confirmation/${data.order.id}`);

              setTimeout(() => {
                fetch("/api/cart/sync", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ items: [] }),
                }).catch(console.error);
                localStorage.removeItem("cart-storage");
              }, 1000);

            } catch (err: any) {
              toast.error(err.message || "Order creation failed");
              setLoading(false);
            }
          },

          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },

          theme: { color: "#254fda" },
        };

        const razor = new (window as any).Razorpay(options);
        razor.open();
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(240,232,231,1)_80%,rgba(240,232,231,1)_100%)] lg:py-10 py-5">
      <main className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Collapsible open={addressOpen} onOpenChange={setAddressOpen}>
              <Card className="rounded-2xl shadow-md !pb-0 !pt-0 w-full relative bg-[#fff]">
                <CollapsibleTrigger asChild className="!py-5">
                  <CardHeader className="cursor-pointer hover:bg-[#f3f4f680] transition-colors rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#fff2e5] flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-[#ff8000]" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-[#000] flex items-center gap-2">
                            Delivery Address
                            {addressSaved && (
                              <CheckCircle2 className="h-5 w-5 text-[#28af60]" />
                            )}
                          </CardTitle>
                          <p className="text-sm text-[#6a7181]">
                            {addressSaved ? "Address saved" : "Where should we deliver?"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-[#6a7181] transition-transform ${addressOpen ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    {/* First Name & Last Name */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="firstName">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) =>
                            handleFieldChange("firstName", e.target.value, setFirstName)
                          }
                          placeholder="John"
                          className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                            errors.firstName ? "border-red-500 focus-visible:border-red-500" : ""
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="lastName">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) =>
                            handleFieldChange("lastName", e.target.value, setLastName)
                          }
                          placeholder="Doe"
                          className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                            errors.lastName ? "border-red-500 focus-visible:border-red-500" : ""
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label className="text-[#020817] text-sm mb-1 block" htmlFor="phone">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) =>
                          handleFieldChange(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                            setPhone
                          )
                        }
                        placeholder="9876543210"
                        maxLength={10}
                        className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                          errors.phone ? "border-red-500 focus-visible:border-red-500" : ""
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Street Address */}
                    <div className="space-y-2">
                      <Label className="text-[#020817] text-sm mb-1 block" htmlFor="address">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) =>
                          handleFieldChange("address", e.target.value, setAddress)
                        }
                        placeholder="123 Main Street"
                        className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                          errors.address ? "border-red-500 focus-visible:border-red-500" : ""
                        }`}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>

                    {/* Building, Apartment, Landmark */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="building">
                          Building (Optional)
                        </Label>
                        <Input
                          id="building"
                          value={building}
                          onChange={(e) => setBuilding(e.target.value)}
                          placeholder="Tower A"
                          className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="apartment">
                          Apartment (Optional)
                        </Label>
                        <Input
                          id="apartment"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          placeholder="4B"
                          className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="landmark">
                          Landmark (Optional)
                        </Label>
                        <Input
                          id="landmark"
                          value={landmark}
                          onChange={(e) => setLandmark(e.target.value)}
                          placeholder="Near Mall"
                          className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                        />
                      </div>
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="city">
                          City *
                        </Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => handleFieldChange("city", e.target.value, setCity)}
                          placeholder="Mumbai"
                          className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                            errors.city ? "border-red-500 focus-visible:border-red-500" : ""
                          }`}
                        />
                        {errors.city && (
                          <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="state">
                          State *
                        </Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => handleFieldChange("state", e.target.value, setState)}
                          placeholder="Maharashtra"
                          className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                            errors.state ? "border-red-500 focus-visible:border-red-500" : ""
                          }`}
                        />
                        {errors.state && (
                          <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[#020817] text-sm mb-1 block" htmlFor="pincode">
                          PIN Code *
                        </Label>
                        <Input
                          id="pincode"
                          value={pincode}
                          onChange={(e) =>
                            handleFieldChange(
                              "pincode",
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                              setPincode
                            )
                          }
                          placeholder="400001"
                          maxLength={6}
                          className={`h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000] ${
                            errors.pincode ? "border-red-500 focus-visible:border-red-500" : ""
                          }`}
                        />
                        {errors.pincode && (
                          <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveAddress}
                      className="w-full mt-2 cursor-pointer !border-[#254fda] !bg-[#254fda] hover:!bg-[#1e40af] mb-5 !text-[#fff]"
                      variant="outline"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2 !text-[#fff]" />
                      {addressSaved ? "Update Address" : "Save Address"}
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
              {addressSaved && !addressOpen && (
                <Button
                  onClick={() => {
                    setAddressOpen(true);
                    setAddressSaved(false);
                  }}
                  variant="outline"
                  className="w-full mt-2 cursor-pointer !border-[#254fda] !bg-[#254fda] hover:!bg-[#1e40af] mb-5 !text-[#fff]"
                >
                  Edit Address
                </Button>
              )}
            </Collapsible>

            {/* Payment Method */}
            <Card className="rounded-2xl shadow-md p-6 w-full relative bg-[#fff]">
              <CardHeader className="lg:px-6 px-0">
                <div className="flex items-center gap-3 px-0">
                  <div className="h-10 w-10 rounded-full bg-[#fff2e5] flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#ff8000]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-[#000]">Payment Method</CardTitle>
                    <p className="text-sm text-[#6a7181]">All transactions are secure</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="lg:px-6 px-0">
                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === "razorpay"
                        ? "border-[#254fda] bg-[#254fda0d]"
                        : "border-[#e2e4e9] hover:border-[#254fda]"
                    }`}
                    onClick={() => setPaymentMethod(prev => prev === "razorpay" ? "" : "razorpay")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === "razorpay" ? "border-[#254fda] bg-[#254fda]" : "border-gray-300"
                      }`}>
                        {paymentMethod === "razorpay" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <label className="cursor-pointer font-medium text-[#000]">Pay Online</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs text-[#000]">UPI</Badge>
                      <Badge variant="secondary" className="text-xs text-[#000]">Card</Badge>
                      <Badge variant="secondary" className="text-xs text-[#000]">NetBanking</Badge>
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-[#254fda] bg-[#28af600d]"
                        : "border-[#e2e4e9] hover:border-[#254fda]"
                    }`}
                    onClick={() => setPaymentMethod(prev => prev === "cod" ? "" : "cod")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        paymentMethod === "cod" ? "border-[#254fda] bg-[#254fda]" : "border-gray-300"
                      }`}>
                        {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <label className="cursor-pointer font-medium text-[#000]">Cash on Delivery</label>
                    </div>
                    <Badge variant="outline" className="text-xs text-[#000]">+₹30</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <Card className="rounded-2xl shadow-md p-4 w-full relative bg-[#fff] sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl font-bold text-[hsl(240_15%_10%)]">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={`${item.image}`}
                        alt={item.title || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#21242c] line-clamp-2">{item.title}</h4>
                      <p className="text-sm text-[#6a7181]">Qty: {item.quantity}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-semibold text-[#000]">₹{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Coupon */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-[#000]">
                    <Tag className="h-4 w-4 text-[#000]" />
                    Apply Coupon
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                      disabled={!!appliedCoupon}
                      className="h-11 bg-[#ffffff] border-input focus-visible:border-[#254fda] focus-visible:ring-2 focus-visible:ring-[#254fda] focus-visible:ring-offset-0 placeholder:text-[#0f0f0] text-[#000]"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || !!appliedCoupon}
                      className="!text-[#fff] cursor-pointer !border-[#254fda] !bg-[#254fda] h-11"
                    >
                      Apply
                    </Button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-sm text-[#28af60] flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Coupon applied! You save ₹{discount}
                    </p>
                  )}
                  <p className="text-xs text-[#6a7181]">Try: SAVE10</p>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6a7181]">Subtotal</span>
                    <span className="text-[#000]">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6a7181] flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" /> Shipping
                    </span>
                    <span className={shipping === 0 ? "text-[#28af60]" : ""}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(240_8%_45%)]">Tax</span>
                    <span className="font-semibold text-[hsl(240_15%_10%)]">₹{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#28af60]">
                      <span>Coupon Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-[#000]">Total</span>
                  <span className="font-bold text-2xl text-[#21242c]">₹{total.toLocaleString()}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod}
                  className="w-full h-13 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)] font-bold text-sm md:text-base rounded-xl shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] hover:shadow-[0_10px_40px_-8px_hsl(252_80%_60%/0.18),0_4px_16px_-4px_hsl(240_15%_10%/0.06)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-2 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {!paymentMethod
                    ? "Select Payment Method"
                    : paymentMethod === "cod"
                    ? `Place Order ₹${total.toLocaleString()}`
                    : `Pay ₹${total.toLocaleString()}`}
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[#6a7181]">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-[#254fda]" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4 text-[#254fda]" />
                    <span>256-bit SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <MobileCheckoutBar
              total={total}
              itemCount={itemCount}
              onPayClick={handlePlaceOrder}
              addressSaved={addressSaved}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutCart;