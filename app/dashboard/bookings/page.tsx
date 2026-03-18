"use client";

import { useRouter } from "next/navigation";
import { useBusiness } from "@/contexts/BusinessContext";
import BookingsTab from "@/components/dashboard/BookingsTab";
import { BookingsEmpty } from "@/components/dashboard/EmptyState";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

export default function BookingsPage() {
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

  return (
    <BookingsTab businessId={business.id} businessName={business.business_name} />
  );
}
