"use client";

import { SpinnerCustom } from "@/components/Loader/SpinningLoader";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  ArrowLeft,
  Clock,
  Wallet,
  RotateCcw,
  Ban,
  Info,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  paymentMethod: "COD" | "RAZORPAY" | "WALLET";
  deliveryId?: string | null;
  deliveryStatus?: "PENDING" | "IN_TRANSIT" | "SUCCESS" | "FAILED";
  createdAt: string;
  refundStatus?: string | null;
  refundDestination?: "ORIGINAL_SOURCE" | "WALLET" | null;
  refundReason?: string | null;
  refundAmount?: number | null;
  items: OrderItem[];
}

const getEstimatedDelivery = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 5);
  return deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const CANCELLABLE_STATUSES = new Set(["PENDING", "PROCESSING"]);

const OrderConfirmation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const estimatedDelivery = getEstimatedDelivery();

  const isCOD = order?.paymentMethod === "COD";
  const isPrepaid = order?.paymentMethod === "RAZORPAY" || order?.paymentMethod === "WALLET";
  const canCancel = order ? CANCELLABLE_STATUSES.has(order.status) : false;
  const isCodRefundEligible = useMemo(() => {
    if (!order) return false;
    return (
      order.paymentMethod === "COD" &&
      order.status === "DELIVERED" &&
      !!order.deliveryId &&
      order.deliveryStatus === "SUCCESS" &&
      !order.refundStatus
    );
  }, [order]);
  const canRefund = useMemo(() => {
    if (!order) return false;
    if (order.refundStatus) return false;
    if (order.status === "CANCELLED" || order.status === "REFUNDED") return false;
    if (isCodRefundEligible) return true;
    if (!isPrepaid) return false;
    return true;
  }, [order, isPrepaid, isCodRefundEligible]);

  const progressSteps = [
    { icon: CheckCircle, label: "Confirmed" },
    { icon: Package, label: "Processing" },
    { icon: Truck, label: "Shipped" },
    { icon: MapPin, label: "Delivered" },
  ];
  const statusToStep: Record<string, number> = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPED: 2,
    DELIVERED: 3,
    REFUNDED: 3,
  };
  const activeStepIndex = order ? (statusToStep[order.status] ?? 0) : 0;
  const progressPercent = (activeStepIndex / (progressSteps.length - 1)) * 100;

  const loadOrder = async () => {
    if (!orderId) return;
    try {
      setIsLoadingOrder(true);
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load order");
    } finally {
      setIsLoadingOrder(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleCancel = async (refundToWallet: boolean) => {
    if (!order) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          reason: "Cancelled by customer",
          refundToWallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel order");
      await loadOrder();
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = async (refundToWallet: boolean) => {
    if (!order) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          reason: "Customer requested refund",
          refundToWallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request refund");
      await loadOrder();
    } catch (err: any) {
      alert(err.message || "Failed to request refund");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const total = order?.amount || subtotal + shipping + tax;
  const isCancelled = order?.status === "CANCELLED";
  const isRefunded = order?.status === "REFUNDED";
  const pageTitle = isCancelled ? "Order Cancelled" : isRefunded ? "Order Refunded" : "Order Confirmed";
  const pageSubtitle = isCancelled
    ? "Your order has been cancelled successfully."
    : isRefunded
      ? "Your refund request is completed."
      : "Thank you for your purchase.";

  if (isLoadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center">
          <SpinnerCustom />
          <p className="text-[hsl(240_8%_45%)]">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center max-w-md px-4">
          <h1 className="text-xl font-bold text-[hsl(240_15%_10%)] mb-2">Unable to Load Order</h1>
          <p className="text-sm text-[hsl(240_8%_45%)] mb-4">{error || "Order not found"}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[hsl(252_80%_60%)] text-white rounded-lg"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(240_10%_98%)]">
      <header className="border-b border-[hsl(240_10%_90%/0.6)] bg-[hsl(0_0%_100%/0.8)] backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-[hsl(252_80%_60%)]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        {order.refundStatus && (
          <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-700">
              Refund Status: {order.refundStatus}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Destination: {order.refundDestination === "WALLET" ? "Wallet" : "Original source"}
            </p>
          </div>
        )}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div
            className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center ${
              isCancelled
                ? "bg-[linear-gradient(135deg,hsl(0_75%_55%),hsl(0_70%_45%))]"
                : "bg-[linear-gradient(135deg,hsl(152_65%_45%),hsl(160_70%_40%))]"
            }`}
          >
            {isCancelled ? (
              <Ban className="w-10 h-10 md:w-12 md:h-12 text-[hsl(0_0%_100%)]" />
            ) : (
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-[hsl(0_0%_100%)]" />
            )}
          </div>
        </motion.div>

        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-[hsl(240_15%_10%)] mb-2">
            {pageTitle}
          </h1>
          <p className="text-sm md:text-base text-[hsl(240_8%_45%)]">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 md:mb-10">
          <div className="flex items-center gap-2.5 bg-white border rounded-xl px-4 py-3 shadow-sm">
            <Package className="w-4 h-4 text-[hsl(252_80%_60%)]" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[hsl(240_8%_45%)]">Order ID</p>
              <p className="text-sm font-bold text-[hsl(240_15%_10%)]">{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white border rounded-xl px-4 py-3 shadow-sm">
            <Clock className="w-4 h-4 text-[hsl(16_90%_58%)]" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[hsl(240_8%_45%)]">
                Estimated Delivery
              </p>
              <p className="text-sm font-bold text-[hsl(240_15%_10%)]">{estimatedDelivery}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-5 md:p-7 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-[hsl(240_15%_10%)]">Order Progress</h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(240_10%_95%)] text-[hsl(240_15%_10%)]">
              {order.status}
            </span>
          </div>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-1 bg-[hsl(240_8%_93%)] rounded-full">
              <div
                className="h-1 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {progressSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= activeStepIndex
                      ? "bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))]"
                      : "bg-[hsl(240_8%_93%)]"
                  }`}
                >
                  <step.icon className={`w-4 h-4 ${i <= activeStepIndex ? "text-white" : "text-[hsl(240_8%_45%)]"}`} />
                </div>
                <span className={`text-[10px] ${i <= activeStepIndex ? "text-[hsl(240_15%_10%)] font-semibold" : "text-[hsl(240_8%_45%)]"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          <div className="lg:col-span-3 bg-white border rounded-2xl p-5 md:p-7 shadow-sm">
            <h3 className="text-base font-bold text-[hsl(240_15%_10%)] mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_10%_95%/0.4)]"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[hsl(240_10%_95%)]">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-[hsl(240_8%_45%)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[hsl(240_15%_10%)] truncate">{item.title}</p>
                    <p className="text-xs text-[hsl(240_8%_45%)]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[hsl(240_15%_10%)]">
                    Rs {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border rounded-2xl p-5 md:p-7 shadow-sm h-fit">
            <h3 className="text-base font-bold text-[hsl(240_15%_10%)] mb-4">Payment Summary</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)]">Subtotal</span>
                <span className="font-semibold text-[hsl(240_15%_10%)]">Rs {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)]">Shipping</span>
                <span className="font-semibold text-[hsl(152_65%_45%)]">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)]">Tax</span>
                <span className="font-semibold text-[hsl(240_15%_10%)]">Rs {tax.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-px bg-[hsl(240_10%_90%)] mb-4" />
            <div className="flex justify-between items-center mb-5">
              <span className="text-base font-bold text-[hsl(240_15%_10%)]">Total Paid</span>
              <span className="text-xl md:text-2xl font-bold text-[hsl(240_15%_10%)]">
                Rs {total.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-[hsl(240_8%_45%)]">
              Paid via: <span className="font-semibold">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          {canCancel && isPrepaid && (
            <>
              <button
                disabled={isProcessing}
                onClick={() => handleCancel(true)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                Cancel + Instant Wallet Refund
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleCancel(false)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-red-50 border border-red-200 text-red-700 font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Ban className="w-4 h-4" />
                Cancel + Refund to Original Source
              </button>
            </>
          )}

          {canCancel && isCOD && (
            <button
              disabled={isProcessing}
              onClick={() => setIsCancelDialogOpen(true)}
              className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-red-50 border border-red-200 text-red-700 font-semibold text-sm rounded-xl disabled:opacity-60"
            >
              <Ban className="w-4 h-4" />
              Cancel Order (COD)
            </button>
          )}

          {canRefund && isPrepaid && (
            <>
              <button
                disabled={isProcessing}
                onClick={() => handleRefund(true)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                Refund to Wallet (Instant)
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleRefund(false)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                Refund to Original Source
              </button>
            </>
          )}

          {canRefund && isCOD && (
            <button
              disabled={isProcessing}
              onClick={() => handleRefund(true)}
              className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
            >
              <Wallet className="w-4 h-4" />
              COD Refund to Wallet (Instant)
            </button>
          )}
        </div>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="block p-0 overflow-hidden xs:rounded-[20px] rounded-none xs:max-w-lg max-w-full fixed xs:top-1/2 xs:-translate-y-1/2 top-0 translate-y-0 xs:bottom-[unset] bottom-[0] border-none [&>button]:hidden z-200">
            <DialogHeader>
              <DialogTitle className="hidden">Cancel this order?</DialogTitle>
              <div className={`relative justify-end items-start relative h-[200px] flex xs:px-6 px-4 xs:py-5 py-2 bg-[#FF0000]`}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <Info size={130} color="red" fill="white" />
                </div>
                <DialogClose
                    className="text-white opacity-90 hover:opacity-100 cursor-pointer outline-none ring-0 focus:ring-0 focus-visible:ring-0 ring-offset-0 z-3">
                    <X size={30} className="fill-[#053E54] xs:fill-white" />
                </DialogClose>
            </div>
            </DialogHeader>
             <div className="bg-white h-full xs:px-6 px-4 py-6">
                <div className="xs:pb-0 pb-0 flex flex-col justify-between xs:h-auto h-full">
                    <div>
                        <div className="relative text-center">
                            <h2 className="text-[20px] font-bold bg-gradient-to-r from-[#FF181C] to-[#053E54] bg-clip-text text-transparent xs:mb-4 inline-block">Cancel?</h2>
                        </div>
                        <p className="text-[#666666] mt-2 xs:text-[18px] text-sm font-400 xs:text-start text-center">Are you sure, You want to cancel? . If you have any concern Please contact us at support@blendras.in.</p>
                    </div>
                    <div className="sticky bottom-0 pb-[20px] xs:mt-5 xs:[position:unset] xs:[bottom:unset] xs:pb-0">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsCancelDialogOpen(false)}
                                disabled={isProcessing}
                                className="w-full h-[40px] bg-[#FFE7E7] border border-[#FF0000] rounded-[20px] text-[#FF0000] font-semibold text-[16px] cursor-pointer uppercase"
                            >
                                Keep Order
                            </button>
                            <button
                                 onClick={async () => {
                                    setIsCancelDialogOpen(false);
                                    await handleCancel(false);
                                  }}
                                  disabled={isProcessing}
                                className="w-full h-[40px] bg-[#FFE7E7] border border-[#FF0000] rounded-[20px] text-[#FF0000] font-semibold text-[16px] cursor-pointer uppercase"
                            >
                                 {isProcessing ? "Cancelling..." : "Cancel Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OrderConfirmation;
