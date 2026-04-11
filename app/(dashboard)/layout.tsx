import Sidebar from '@/components/dashboard/Sidebar'
import TopBar from '@/components/dashboard/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#050510] overflow-hidden text-white font-sans">
      {/* Premium Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Navigation */}
        <TopBar />

        {/* Dynamic Content Area with Grid */}
        <main className="flex-1 overflow-y-auto relative scrollbar-hide">
          {/* Neural Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,255,71,0.02),transparent_70%)] pointer-events-none" />
          
          <div className="p-6 md:p-10 max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* Global Toast / Notification Layer can go here */}
    </div>
  )
}
