import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In a real implementation, we would fetch the business data here
  // For now, we'll pass empty props and the client components will handle the data

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Sidebar - fixed left */}
      <Sidebar />

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
