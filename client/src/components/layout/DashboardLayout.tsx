import { Outlet } from "react-router-dom"
import { TopNav } from "./TopNav"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#07090D] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(148,210,189,0.08),rgba(255,255,255,0))] flex flex-col text-white antialiased">
      {/* Topward Navigation Menu */}
      <TopNav />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1520px] mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
