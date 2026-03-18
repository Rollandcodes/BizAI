"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Search, Filter, Check, X, Clock, ChefHat, Bell, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/contexts/BusinessContext";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

type Order = {
  id: string;
  business_id: string;
  conversation_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  items: unknown[];
  total_amount: number;
  status: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "done", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_CLASSES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-700", label: "Pending" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed" },
  preparing: { bg: "bg-purple-100", text: "text-purple-700", label: "Preparing" },
  ready: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Ready" },
  done: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "done"];

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function OrdersPage() {
  const router = useRouter();
  const { business, loading: contextLoading, isAuthenticated } = useBusiness();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<Set<string>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (!contextLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [contextLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!business) {
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from("orders")
          .select("*")
          .eq("business_id", business.id)
          .order("created_at", { ascending: false });

        if (statusFilter !== "all") {
          query = query.eq("status", statusFilter);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching orders:", error);
          return;
        }

        setOrders((data as Order[]) ?? []);
      } finally {
        setLoading(false);
      }
    }

    if (business) {
      void fetchOrders();
    }
  }, [business, statusFilter]);

  async function updateOrderStatus(orderId: string, newStatus: string) {
    if (!business) return;

    setUpdating((prev) => new Set(prev).add(orderId));

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId)
      .eq("business_id", business.id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }

    setUpdating((prev) => {
      const next = new Set(prev);
      next.delete(orderId);
      return next;
    });
  }

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_phone?.includes(query) ||
      order.notes?.toLowerCase().includes(query)
    );
  });

  const getNextStatus = (currentStatus: string) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  if (contextLoading || loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <ChatSkeleton />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <p className="text-slate-500">No business found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Orders</h1>
        <p className="text-sm text-slate-500">
          Manage customer orders and track their status.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                statusFilter === status.value
                  ? "bg-[#1a1a2e] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 sm:w-64"
          />
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusStyle = STATUS_CLASSES[order.status] || STATUS_CLASSES.pending;
            const nextStatus = getNextStatus(order.status);

            return (
              <div
                key={order.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {order.customer_name}
                      </h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                      {order.source === "whatsapp" && (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          WhatsApp
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {order.customer_phone && (
                        <span>{order.customer_phone}</span>
                      )}
                      <span>{formatDate(order.created_at)}</span>
                      <span className="text-gray-400">{getTimeAgo(order.created_at)}</span>
                    </div>
                    {order.notes && (
                      <p className="mt-2 text-sm text-gray-600">{order.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          disabled={updating.has(order.id)}
                          className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                        >
                          {nextStatus === "confirmed" && <Check className="h-4 w-4" />}
                          {nextStatus === "preparing" && <ChefHat className="h-4 w-4" />}
                          {nextStatus === "ready" && <Bell className="h-4 w-4" />}
                          {nextStatus === "done" && <Check className="h-4 w-4" />}
                          {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                        </button>
                      )}
                      {order.status !== "cancelled" && order.status !== "done" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "cancelled")}
                          disabled={updating.has(order.id)}
                          className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      )}
                      {order.conversation_id && (
                        <button
                          onClick={() => router.push(`/dashboard/conversations?id=${order.conversation_id}`)}
                          className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                        >
                          <ArrowRight className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
