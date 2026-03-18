"use client";

import { useRouter } from "next/navigation";
import { useBusiness } from "@/contexts/BusinessContext";
import AnalyticsTab from "@/components/dashboard/AnalyticsTab";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

export default function AnalyticsPage() {
  const router = useRouter();
  const { business, loading: contextLoading, isAuthenticated } = useBusiness();

  // Redirect if not authenticated
  if (!contextLoading && !isAuthenticated) {
    router.push("/login");
  }

  if (contextLoading) {
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

  return <AnalyticsTab businessId={business.id} />;
}
