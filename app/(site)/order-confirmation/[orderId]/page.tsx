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
  X,
  ImagePlus,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
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
  refundProofImages?: string[];
  cancellationReason?: string | null;
  cancellationComment?: string | null;
  cancelledAt?: string | null;
  items: OrderItem[];
}

const CANCEL_REASONS = [
  "Incorrect size ordered",
  "Product not required anymore",
  "Cash issue",
  "Ordered by mistake",
  "Want to change style/color",
  "Delayed delivery",
  "Duplicate order",
];

const REFUND_REASONS = [
  "Product damaged",
  "Wrong product delivered",
  "Quality not as expected",
  "Missing items in package",
  "Received too late",
  "No longer needed",
];

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

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const getRefundDestinationLabel = (destination?: "ORIGINAL_SOURCE" | "WALLET" | null) => {
  if (destination === "WALLET") return "Wallet";
  if (destination === "ORIGINAL_SOURCE") return "Original payment method (UPI/Card/Bank)";
  return "Not set";
};

const OrderConfirmation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const orderId = pathname.split("/").pop() || "";

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>("");
  const [cancelComment, setCancelComment] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState<string | null>(null);
  const [cancelRefundToWallet, setCancelRefundToWallet] = useState<boolean>(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundReasonError, setRefundReasonError] = useState<string | null>(null);
  const [refundToWallet, setRefundToWallet] = useState(false);
  const [refundProofImages, setRefundProofImages] = useState<string[]>([]);
  const [isUploadingProof, setIsUploadingProof] = useState(false);

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
    if (order.status !== "DELIVERED") return false;
    if (isCodRefundEligible) return true;
    return isPrepaid;
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

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setIsLoadingOrder(true);
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
      setError(null);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load order"));
    } finally {
      setIsLoadingOrder(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const openCancelDialog = (refundToWallet: boolean) => {
    setCancelRefundToWallet(refundToWallet);
    setSelectedCancelReason("");
    setCancelComment("");
    setCancelReasonError(null);
    setIsCancelDialogOpen(true);
  };

  const openRefundDialog = (nextRefundToWallet: boolean) => {
    setRefundToWallet(nextRefundToWallet);
    setRefundReason("");
    setRefundReasonError(null);
    setRefundProofImages([]);
    setIsRefundDialogOpen(true);
  };

  const handleRefundProofUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const existingCount = refundProofImages.length;
    const allowed = Math.max(0, 3 - existingCount);
    if (allowed <= 0) {
      alert("You can upload up to 3 images only.");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, allowed);

    setIsUploadingProof(true);
    try {
      const uploaded: string[] = [];
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/uploads/refund-proof", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to upload image");
        }
        uploaded.push(data.url);
      }
      setRefundProofImages((prev) => [...prev, ...uploaded].slice(0, 3));
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Failed to upload refund proof image"));
    } finally {
      setIsUploadingProof(false);
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    if (!selectedCancelReason) {
      setCancelReasonError("Please select a cancellation reason.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          reason: selectedCancelReason,
          comment: cancelComment,
          refundToWallet: cancelRefundToWallet,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel order");

      setIsCancelDialogOpen(false);
      await loadOrder();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Failed to cancel order"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefund = async () => {
    if (!order) return;
    if (!refundReason) {
      setRefundReasonError("Please select a refund reason.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          reason: refundReason,
          refundToWallet,
          proofImages: refundProofImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request refund");
      setIsRefundDialogOpen(false);
      await loadOrder();
    } catch (error: unknown) {
      alert(getErrorMessage(error, "Failed to request refund"));
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
              Destination: {getRefundDestinationLabel(order.refundDestination)}
            </p>
            {order.refundDestination === "ORIGINAL_SOURCE" && order.paymentMethod === "RAZORPAY" && (
              <p className="text-xs text-yellow-700 mt-1">
                Razorpay merchants can track this in Dashboard {`>`} Payments {`>`} Refunds.
              </p>
            )}
            {!!order.refundProofImages?.length && (
              <div className="mt-3 flex flex-wrap gap-2">
                {order.refundProofImages.map((img) => (
                  <a
                    key={img}
                    href={img}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-16 h-16 rounded-md overflow-hidden border border-yellow-300 bg-white"
                  >
                    <img src={img} alt="Refund proof" className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            )}
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

        {isCancelled && order.cancellationReason && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm font-semibold text-red-700">Cancellation Reason</p>
            <p className="text-sm text-red-700 mt-1">{order.cancellationReason}</p>
            {order.cancellationComment && (
              <p className="text-xs text-red-600 mt-2">Comment: {order.cancellationComment}</p>
            )}
          </div>
        )}

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
                onClick={() => openCancelDialog(true)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                Cancel + Instant Wallet Refund
              </button>
              <button
                disabled={isProcessing}
                onClick={() => openCancelDialog(false)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-red-50 border border-red-200 text-red-700 font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Ban className="w-4 h-4" />
                Cancel + Refund to Payment Method
              </button>
            </>
          )}

          {canCancel && isCOD && (
            <button
              disabled={isProcessing}
              onClick={() => openCancelDialog(false)}
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
                onClick={() => openRefundDialog(true)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <Wallet className="w-4 h-4" />
                Refund to Wallet (Instant)
              </button>
              <button
                disabled={isProcessing}
                onClick={() => openRefundDialog(false)}
                className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-orange-50 border border-orange-200 text-orange-700 font-semibold text-sm rounded-xl disabled:opacity-60"
              >
                <RotateCcw className="w-4 h-4" />
                Refund to Payment Method
              </button>
            </>
          )}

          {canRefund && isCOD && (
            <button
              disabled={isProcessing}
              onClick={() => openRefundDialog(true)}
              className="cursor-pointer flex items-center justify-center gap-2 h-11 px-4 bg-[#ecfdf3] border border-[#a7f3d0] text-[#166534] font-semibold text-sm rounded-xl disabled:opacity-60"
            >
              <Wallet className="w-4 h-4" />
              COD Refund to Wallet (Instant)
            </button>
          )}
        </div>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-[#fff]">
            <DialogHeader className="px-5 pt-5 pb-3 border-b bg-[hsl(240_10%_98%)]">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-bold text-[hsl(240_15%_10%)]">
                  Reason for Cancellation
                </DialogTitle>
                <DialogClose className="cursor-pointer text-[hsl(240_8%_45%)]">
                  <X className="w-5 h-5" />
                </DialogClose>
              </div>
              <p className="text-sm text-[hsl(240_8%_45%)]">
                Please tell us the reason. This helps improve our service.
              </p>
            </DialogHeader>

            <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {CANCEL_REASONS.map((reason) => (
                  <label key={reason} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason}
                      checked={selectedCancelReason === reason}
                      onChange={() => {
                        setSelectedCancelReason(reason);
                        setCancelReasonError(null);
                      }}
                      className="mt-1"
                    />
                    <span className="text-sm text-[hsl(240_15%_10%)]">{reason}</span>
                  </label>
                ))}
                {cancelReasonError && (
                  <p className="text-xs text-red-600">{cancelReasonError}</p>
                )}
              </div>

              <div>
                <label htmlFor="cancel-comment" className="block text-sm font-medium text-[hsl(240_15%_10%)] mb-1.5">
                  Additional Comments (Optional)
                </label>
                <textarea
                  id="cancel-comment"
                  value={cancelComment}
                  onChange={(e) => setCancelComment(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Tell us more..."
                  className="w-full border border-[hsl(240_10%_85%)] rounded-lg px-3 py-2 text-sm outline-none focus:border-[hsl(252_80%_60%)]"
                />
              </div>
            </div>

            <DialogFooter className="px-5 py-4 border-t bg-white flex flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
                disabled={isProcessing}
              >
                Keep Order
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                disabled={isProcessing}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isProcessing ? "Cancelling..." : "Cancel Order"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
          <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-[#fff]">
            <DialogHeader className="px-5 pt-5 pb-3 border-b bg-[hsl(240_10%_98%)]">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-bold text-[hsl(240_15%_10%)]">
                  Request Refund
                </DialogTitle>
                <DialogClose className="cursor-pointer text-[hsl(240_8%_45%)]">
                  <X className="w-5 h-5" />
                </DialogClose>
              </div>
              <p className="text-sm text-[hsl(240_8%_45%)]">
                Tell us why you want a refund and upload proof images (optional).
              </p>
            </DialogHeader>

            <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {REFUND_REASONS.map((reason) => (
                  <label key={reason} className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="refund-reason"
                      value={reason}
                      checked={refundReason === reason}
                      onChange={() => {
                        setRefundReason(reason);
                        setRefundReasonError(null);
                      }}
                      className="mt-1"
                    />
                    <span className="text-sm text-[hsl(240_15%_10%)]">{reason}</span>
                  </label>
                ))}
                {refundReasonError && <p className="text-xs text-red-600">{refundReasonError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(240_15%_10%)] mb-1.5">
                  Upload Images (optional, max 3)
                </label>
                <label className="h-11 px-3 rounded-lg border border-[hsl(240_10%_85%)] flex items-center gap-2 text-sm cursor-pointer w-fit">
                  {isUploadingProof ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImagePlus className="w-4 h-4" />
                      Choose Images
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => handleRefundProofUpload(e.target.files)}
                    className="hidden"
                    disabled={isUploadingProof}
                  />
                </label>
                {!!refundProofImages.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {refundProofImages.map((img, idx) => (
                      <div key={`${img}-${idx}`} className="relative w-16 h-16 rounded-md overflow-hidden border">
                        <img src={img} alt="Proof" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setRefundProofImages((prev) => prev.filter((_, i) => i !== idx))
                          }
                          className="absolute top-0 right-0 bg-black/70 text-white text-[10px] leading-none px-1 py-0.5"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="px-5 py-4 border-t bg-white flex flex-row justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRefundDialogOpen(false)}
                disabled={isProcessing || isUploadingProof}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRefund}
                disabled={isProcessing || isUploadingProof}
                className="bg-[hsl(252_80%_60%)] hover:bg-[hsl(252_80%_52%)] text-white"
              >
                {isProcessing ? "Submitting..." : "Submit Refund Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OrderConfirmation;
