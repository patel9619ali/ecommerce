"use client";
import { SpinnerCustom } from "@/components/Loader/SpinningLoader";
import { useLoading } from "@/context/LoadingContext";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  ArrowLeft,
  Download,
  Share2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  productId: string;
  variantId: string;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
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

const OrderConfirmation = () => {
  const params = useParams();
  const router = useRouter();
  const { setLoading } = useLoading();

  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const estimatedDelivery = getEstimatedDelivery();

  // ✅ Step 1: Safely resolve orderId from params (empty on first render in prod)
  useEffect(() => {
    const raw = params?.orderId;
    const id = (Array.isArray(raw) ? raw[0] : raw) ?? '';
    if (id) setOrderId(id);
  }, [params]);

 

  // ✅ Step 3: Fetch order only when orderId is available
  useEffect(() => {
    if (!orderId) return;
    if (hasFetched.current) return;
    hasFetched.current = true;

    // ✅ Check sessionStorage FIRST — this is the key fix
    // After payment redirect, order is cached here to avoid DB race condition
    try {
      const cached = sessionStorage.getItem('lastOrder');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id === orderId) {
          setOrder(parsed);
          setIsLoadingOrder(false);
          sessionStorage.removeItem('lastOrder');
          return; // ✅ Done — no API call needed
        }
      }
    } catch (e) {
      console.error('❌ Cache parse error:', e);
    }

    // ✅ Fetch from API with retry (handles DB write delay)
    const fetchOrder = async (attempt = 0): Promise<void> => {
      try {
        const baseUrl = window.location.origin; // 👈 absolute URL for production
        const res = await fetch(`${baseUrl}/api/orders/${orderId}`, {
          cache: 'no-store',
        });

        if (res.status === 404 && attempt < 4) {
          const delay = (attempt + 1) * 800;
          await new Promise((r) => setTimeout(r, delay));
          return fetchOrder(attempt + 1);
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Order not found');
        if (!data.order) throw new Error('Order data missing');
        setOrder(data.order);
      } catch (err: any) {
        console.error('❌ Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const subtotal =
    order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const shipping = 0;
  const tax = Math.round(subtotal * 0.08);
  const total = order?.amount || subtotal + shipping + tax;

  if (!orderId || isLoadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center">
          <SpinnerCustom />
          <p className="text-[hsl(240_8%_45%)] font-['DM_Sans']">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-[hsl(240_15%_10%)] mb-2">
            Unable to Load Order
          </h1>
          <p className="text-sm text-[hsl(240_8%_45%)] mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[hsl(252_80%_60%)] text-white rounded-lg hover:bg-[hsl(252_80%_50%)]"
          >
            Return to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(252_80%_60%)] mx-auto mb-4"></div>
          <p className="text-[hsl(240_8%_45%)] font-['DM_Sans']">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(240_10%_98%)]">
      <header className="border-b border-[hsl(240_10%_90%/0.6)] bg-[hsl(0_0%_100%/0.8)] backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
          <button
            onClick={() => {
              setLoading(true);
              router.push('/');
            }}
            className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-[hsl(252_80%_60%)] hover:text-[hsl(252_80%_50%)] transition-colors font-['DM_Sans']"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[linear-gradient(135deg,hsl(152_65%_45%),hsl(160_70%_40%))] flex items-center justify-center shadow-[0_8px_30px_-6px_hsl(152_65%_45%/0.4)]"
            >
              <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-[hsl(0_0%_100%)]" />
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-[hsl(152_65%_45%/0.3)]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8 md:mb-10"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-[hsl(240_15%_10%)] mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-sm md:text-base text-[hsl(240_8%_45%)] font-['DM_Sans'] max-w-md mx-auto">
            Thank you for your purchase. We've sent a confirmation email with your order details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 md:mb-10"
        >
          <div className="flex items-center gap-2.5 bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] rounded-xl px-4 py-3 shadow-sm">
            <Package className="w-4 h-4 text-[hsl(252_80%_60%)]" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[hsl(240_8%_45%)] font-['DM_Sans']">
                Order ID
              </p>
              <p className="text-sm font-bold text-[hsl(240_15%_10%)]">{orderId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] rounded-xl px-4 py-3 shadow-sm">
            <Clock className="w-4 h-4 text-[hsl(16_90%_58%)]" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[hsl(240_8%_45%)] font-['DM_Sans']">
                Estimated Delivery
              </p>
              <p className="text-sm font-bold text-[hsl(240_15%_10%)]">{estimatedDelivery}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] rounded-2xl p-5 md:p-7 shadow-sm mb-6"
        >
          <h3 className="text-base font-bold text-[hsl(240_15%_10%)] mb-5">Order Progress</h3>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-6 right-6 h-1 bg-[hsl(240_8%_93%)] rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '33%' }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))]"
              />
            </div>
            {[
              { icon: CheckCircle, label: 'Confirmed', active: true },
              { icon: Package, label: 'Processing', active: false },
              { icon: Truck, label: 'Shipped', active: false },
              { icon: MapPin, label: 'Delivered', active: false },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.active
                      ? 'bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] shadow-[0_4px_12px_-2px_hsl(252_80%_60%/0.4)]'
                      : 'bg-[hsl(240_8%_93%)]'
                  }`}
                >
                  <step.icon
                    className={`w-4 h-4 ${step.active ? 'text-[hsl(0_0%_100%)]' : 'text-[hsl(240_8%_45%)]'}`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium font-['DM_Sans'] ${
                    step.active ? 'text-[hsl(252_80%_60%)]' : 'text-[hsl(240_8%_45%)]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-3 bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] rounded-2xl p-5 md:p-7 shadow-sm"
          >
            <h3 className="text-base font-bold text-[hsl(240_15%_10%)] mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(240_10%_95%/0.4)] hover:bg-[hsl(240_10%_95%/0.7)] transition-colors"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[hsl(240_10%_95%)]">
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
                    <p className="text-xs text-[hsl(240_8%_45%)] font-['DM_Sans']">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[hsl(240_15%_10%)]">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-2 bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.4)] rounded-2xl p-5 md:p-7 shadow-sm h-fit"
          >
            <h3 className="text-base font-bold text-[hsl(240_15%_10%)] mb-4">Payment Summary</h3>
            <div className="space-y-2.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)] font-['DM_Sans']">Subtotal</span>
                <span className="font-semibold text-[hsl(240_15%_10%)]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)] font-['DM_Sans']">Shipping</span>
                <span className="font-semibold text-[hsl(152_65%_45%)]">
                  {shipping === 0 ? 'Free' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(240_8%_45%)] font-['DM_Sans']">Tax</span>
                <span className="font-semibold text-[hsl(240_15%_10%)]">₹{tax.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-px bg-[hsl(240_10%_90%)] mb-4" />
            <div className="flex justify-between items-center mb-5">
              <span className="text-base font-bold text-[hsl(240_15%_10%)]">Total Paid</span>
              <span className="text-xl md:text-2xl font-bold text-[hsl(240_15%_10%)]">
                ₹{total.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 pt-3 border-t border-[hsl(240_10%_90%)]">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[hsl(152_65%_45%)]" />
                <span className="text-[10px] text-[hsl(240_8%_45%)] font-['DM_Sans']">Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[hsl(252_80%_60%)]" />
                <span className="text-[10px] text-[hsl(240_8%_45%)] font-['DM_Sans']">256-bit SSL</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-3 mt-8 justify-center"
        >
          <button
            onClick={() => {
              setLoading(true);
              router.push('/');
            }}
            className="cursor-pointer flex items-center justify-center gap-2 h-12 px-6 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)] font-bold text-sm rounded-xl shadow-[0_8px_30px_-6px_hsl(252_80%_60%/0.35),0_4px_12px_-4px_hsl(16_90%_58%/0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            Continue Shopping
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="cursor-pointer flex items-center justify-center gap-2 h-12 px-6 bg-[hsl(0_0%_100%)] border border-[hsl(240_10%_90%)] text-[hsl(240_15%_10%)] font-semibold text-sm rounded-xl hover:bg-[hsl(240_10%_95%)] transition-all duration-200">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
          <button className="cursor-pointer flex items-center justify-center gap-2 h-12 px-6 bg-[hsl(0_0%_100%)] border border-[hsl(240_10%_90%)] text-[hsl(240_15%_10%)] font-semibold text-sm rounded-xl hover:bg-[hsl(240_10%_95%)] transition-all duration-200">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default OrderConfirmation;