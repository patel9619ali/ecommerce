"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  ArrowLeft, 
  ChevronRight, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { SpinnerCustom } from "@/components/Loader/SpinningLoader";

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

const statusConfig = {
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "hsl(145 70% 45%)" },
  processing: { label: "Processing", icon: Package, color: "hsl(28 90% 55%)" },
  shipped: { label: "Shipped", icon: Truck, color: "hsl(200 80% 50%)" },
  delivered: { label: "Delivered", icon: MapPin, color: "hsl(145 70% 45%)" },
};

const getEstimatedDelivery = (createdAt: string) => {
  const orderDate = new Date(createdAt);
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + 5);

  return deliveryDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MyOrders = () => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const res = await fetch("/api/orders");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setError(err.message);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (orderId: string) => {
    setLoading(true);
    router.push(`/order-confirmation/${orderId}`);
  };

  const handleBackClick = () => {
    setLoading(true);
    router.push("/");
  };

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center">
          <SpinnerCustom/>
          <p className="text-[hsl(240_8%_45%)] font-['DM_Sans']">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(240_10%_98%)]">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className=" text-xl font-bold text-[hsl(240_15%_10%)] mb-2">
            Unable to Load Orders
          </h1>
          <p className="text-sm text-[hsl(240_8%_45%)] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[hsl(252_80%_60%)] text-white rounded-lg hover:bg-[hsl(252_80%_50%)]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(240_10%_98%)]">
      {/* Header */}
      <header className="border-b border-[hsl(240_10%_90%/0.6)] bg-[hsl(0_0%_100%/0.85)] backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackClick}
              className="cursor-pointer flex items-center gap-1.5 text-sm font-medium text-[hsl(252_80%_60%)] hover:text-[hsl(252_80%_50%)] transition-colors font-['DM_Sans']"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className=" text-2xl md:text-3xl font-bold text-[hsl(240_15%_10%)]">
            My Orders
          </h1>
          <p className="text-sm text-[hsl(240_8%_45%)] font-['DM_Sans'] mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"} placed
          </p>
        </motion.div>

        {orders.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-[hsl(252_40%_92%)] flex items-center justify-center mb-5">
              <ShoppingBag className="w-9 h-9 text-[hsl(252_80%_60%)]" />
            </div>
            <h2 className=" text-xl font-bold text-[hsl(240_15%_10%)] mb-2">
              No orders yet
            </h2>
            <p className="text-sm text-[hsl(240_8%_45%)] font-['DM_Sans'] mb-6 text-center max-w-sm">
              Looks like you haven't placed any orders. Start shopping to see your orders here!
            </p>
            <button
              onClick={handleBackClick}
              className="h-11 px-6 bg-[linear-gradient(135deg,hsl(252_80%_60%),hsl(16_90%_58%))] text-[hsl(0_0%_100%)]  font-bold text-sm rounded-xl shadow-[0_6px_24px_-4px_hsl(252_80%_60%/0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.processing;
              const StatusIcon = statusInfo.icon;
              const estimatedDelivery = getEstimatedDelivery(order.createdAt);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleOrderClick(order.id)}
                  className="bg-[hsl(0_0%_100%/0.9)] backdrop-blur-xl border border-[hsl(240_10%_90%/0.5)] rounded-2xl p-4 md:p-5 shadow-[0_2px_12px_-4px_hsl(240_15%_10%/0.06)] hover:shadow-[0_8px_30px_-8px_hsl(252_80%_60%/0.12)] hover:border-[hsl(252_80%_60%/0.3)] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className=" text-sm font-bold text-[hsl(240_15%_10%)]">
                        {order.id}
                      </p>
                      <p className="text-xs text-[hsl(240_8%_45%)] font-['DM_Sans'] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full font-['DM_Sans']"
                        style={{
                          backgroundColor: `${statusInfo.color.replace(")", " / 0.12)")}`,
                          color: statusInfo.color,
                        }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[hsl(240_8%_45%)] group-hover:text-[hsl(252_80%_60%)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="w-11 h-11 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 border-[hsl(0_0%_100%)] bg-[hsl(240_10%_95%)] flex-shrink-0"
                        >
                          {item.image ? (
                            <img 
                              src={`${item.image}`} 
                              alt={item.title} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-[hsl(240_8%_45%)]" />
                            </div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl border-2 border-[hsl(0_0%_100%)] bg-[hsl(252_40%_92%)] flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-[hsl(252_80%_60%)] ">
                            +{order.items.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[hsl(240_8%_45%)] font-['DM_Sans'] truncate">
                        {order.items.map((i) => i.title).join(", ")}
                      </p>
                      <p className="text-xs text-[hsl(240_8%_45%)] font-['DM_Sans'] mt-0.5">
                        {order.items.reduce((a, i) => a + i.quantity, 0)} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className=" text-base md:text-lg font-bold text-[hsl(240_15%_10%)]">
                        ₹{order.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="mt-3 pt-3 border-t border-[hsl(240_10%_90%/0.5)] flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[hsl(16_90%_58%)]" />
                    <span className="text-[11px] text-[hsl(240_8%_45%)] font-['DM_Sans']">
                      Est. delivery: {estimatedDelivery}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;