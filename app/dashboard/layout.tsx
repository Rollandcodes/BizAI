"use client";

import { BusinessProvider, useBusiness } from "@/contexts/BusinessContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { ChatSkeleton } from "@/components/dashboard/Skeleton";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { business, loading, plan } = useBusiness();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <Sidebar businessName="" businessEmail="" plan="starter" />
        <div className="md:ml-[240px]">
          <div className="sticky top-0 z-30 bg-white md:hidden">
            <TopBar />
          </div>
          <main className="flex min-h-screen items-center justify-center p-4 pb-20 md:p-8 md:pb-8">
            <ChatSkeleton />
          </main>
        </div>
      </div>
    );
  }

  // If not authenticated (no business), still show sidebar with defaults
  const businessName = business?.business_name ?? "";
  const businessEmail = business?.owner_email ?? "";

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Sidebar - fixed left */}
      <Sidebar 
        businessName={businessName} 
        businessEmail={businessEmail} 
        plan={plan} 
      />

      {/* Main content area - offset by sidebar width */}
      <div className="md:ml-[240px]">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white md:hidden">
          <TopBar />
        </div>

        {/* Page content */}
        <main className="min-h-screen p-4 pb-20 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <DashboardContent>{children}</DashboardContent>
    </BusinessProvider>
  );
}
