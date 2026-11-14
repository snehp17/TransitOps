import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, Truck, Users, Route as RouteIcon, 
  Wrench, Fuel, BarChart3, Search, Sun, Moon, Bell, 
  Check, LogOut, User, Settings, ChevronRight
} from "lucide-react"
import { useTheme } from "../../context/ThemeProvider"
import { useAuth } from "../../context/AuthContext"
import { cn } from "../../lib/utils"

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Vehicles", href: "/vehicles", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Trips", href: "/trips", icon: RouteIcon },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Expenses", href: "/expenses", icon: Fuel },
  { label: "Reports", href: "/reports", icon: BarChart3 },
]

const notifications = [
  { id: 1, title: "Vehicle #4001 in Maintenance", desc: "Scheduled service overdue by 2 days.", time: "5m ago", type: "warning", read: false },
  { id: 2, title: "Trip TRP-1045 Completed", desc: "Driver Emma Davis finished ORD → DFW.", time: "22m ago", type: "success", read: false },
  { id: 3, title: "Driver License Expiring", desc: "John Doe's license expires in 10 days.", time: "1h ago", type: "danger", read: true },
  { id: 4, title: "New Driver Registered", desc: "Sarah Smith added to crew directory.", time: "3h ago", type: "info", read: true },
]

const SEARCH_INDEX = [
  { label: "Dashboard", sub: "Overview & metrics", href: "/", keywords: "dashboard overview kpi analytics" },
  { label: "Vehicles", sub: "Fleet units & specs", href: "/vehicles", keywords: "vehicles fleet trucks vans trailers" },
  { label: "Drivers", sub: "Crew directory & licenses", href: "/drivers", keywords: "drivers crew people safety" },
  { label: "Trips", sub: "Active & completed journeys", href: "/trips", keywords: "trips routes journeys dispatch" },
  { label: "Maintenance", sub: "Service schedules & logs", href: "/maintenance", keywords: "maintenance service repair shop" },
  { label: "Fuel & Expenses", sub: "Cost tracking & consumption", href: "/expenses", keywords: "fuel expenses cost money" },
  { label: "Reports", sub: "Analytics & data export", href: "/reports", keywords: "reports analytics exports csv" },
  { label: "My Profile", sub: "Account details", href: "/profile", keywords: "profile account user" },
  { label: "Preferences", sub: "Settings & appearance", href: "/preferences", keywords: "preferences settings theme dark" },
]

export function TopNav() {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [readIds, setReadIds] = useState<number[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchCursor, setSearchCursor] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return SEARCH_INDEX.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.sub.toLowerCase().includes(q) ||
      item.keywords.includes(q)
    ).slice(0, 6)
  }, [searchQuery])

  useEffect(() => { setSearchCursor(0) }, [searchResults])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [])

  const handleSearchKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSearchCursor(c => Math.min(c + 1, searchResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSearchCursor(c => Math.max(c - 1, 0))
    } else if (e.key === "Enter" && searchResults[searchCursor]) {
      navigate(searchResults[searchCursor].href)
      setSearchOpen(false)
      setSearchQuery("")
      searchInputRef.current?.blur()
    } else if (e.key === "Escape") {
      setSearchOpen(false)
      setSearchQuery("")
      searchInputRef.current?.blur()
    }
  }, [searchResults, searchCursor, navigate])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const unread = notifications.filter(n => !n.read && !readIds.includes(n.id)).length
  const markAllRead = () => setReadIds(notifications.map(n => n.id))

  const displayName = user?.name || user?.email?.split("@")[0] || "Fleet Manager"
  const displayRole = user?.role?.replace(/_/g, " ") || "Manager"

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6 lg:px-8 z-30 shrink-0">
      <div className="max-w-[1520px] mx-auto bg-[#12161F]/90 backdrop-blur-xl border border-white/[0.08] rounded-[24px] sm:rounded-full px-4 sm:px-6 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        
        {/* Left: Brand Logo + Symbol */}
        <div className="flex items-center gap-3 shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#94D2BD] via-[#52B788] to-[#2D6A4F] flex items-center justify-center shadow-lg shadow-[#52B788]/20 transition-transform group-hover:scale-105">
              <Truck className="w-4.5 h-4.5 text-[#0A100D]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">TransitOps</span>
              <span className="hidden xl:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/[0.06] text-[#94D2BD] border border-white/[0.08]">
                PRO
              </span>
            </div>
          </NavLink>
        </div>

        {/* Center: Upward Top Navigation Menu Pill Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090C11]/70 p-1 rounded-full border border-white/[0.06] overflow-x-auto">
          {navItems.map((item) => {
            const isActive = item.href === "/" 
              ? location.pathname === "/" 
              : location.pathname.startsWith(item.href)

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none whitespace-nowrap",
                  isActive
                    ? "bg-white text-black font-semibold shadow-md shadow-white/10"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <item.icon className={cn("w-3.5 h-3.5", isActive ? "text-black" : "text-zinc-400")} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Right: Search, Theme, Notifications & User */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Quick Search Bar */}
          <div className="relative group hidden lg:block" ref={searchRef}>
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#94D2BD] transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true) }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={handleSearchKey}
              placeholder="Search... ⌘K"
              className="w-44 xl:w-56 bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.08] border border-white/[0.08] focus:border-[#94D2BD]/40 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
            />

            {/* Quick Search Floating Dropdown */}
            {searchOpen && searchQuery.length > 0 && (
              <div className="absolute right-0 top-11 w-72 bg-[#12161F] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-5 text-center text-xs text-zinc-400">
                    No results found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="p-1.5 space-y-0.5">
                    {searchResults.map((r, i) => (
                      <button
                        key={r.href}
                        onClick={() => {
                          navigate(r.href)
                          setSearchOpen(false)
                          setSearchQuery("")
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors",
                          i === searchCursor ? "bg-white/[0.08] text-white" : "text-zinc-300 hover:bg-white/[0.04]"
                        )}
                      >
                        <div>
                          <p className="text-xs font-medium text-white">{r.label}</p>
                          <p className="text-[10px] text-zinc-400">{r.sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
              className={cn(
                "w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all relative",
                notifOpen && "bg-white/[0.1] text-white"
              )}
            >
              <Bell className="w-3.5 h-3.5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#12161F]" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 bg-[#12161F] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    {unread > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#94D2BD]/20 text-[#94D2BD]">{unread}</span>
                    )}
                  </div>
                  <button onClick={markAllRead} className="text-[11px] text-[#94D2BD] hover:underline flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                </div>
                <div className="divide-y divide-white/[0.06] max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-white/[0.03] transition-colors flex gap-2.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-1.5 shrink-0",
                        n.type === "warning" ? "bg-amber-400" : n.type === "success" ? "bg-emerald-400" : "bg-rose-400"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{n.title}</p>
                        <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">{n.desc}</p>
                        <span className="text-[9px] text-zinc-500 mt-1 inline-block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar pill */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
            >
              <img
                src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="hidden sm:inline-block text-xs font-medium text-zinc-200">{displayName}</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 w-56 bg-[#12161F] border border-white/[0.1] rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
                <div className="px-4 py-3 border-b border-white/[0.08]">
                  <p className="text-xs font-semibold text-white">{displayName}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{user?.email || "manager@transitops.com"}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#94D2BD]/15 text-[#94D2BD] mt-1.5">
                    {displayRole}
                  </span>
                </div>
                <div className="py-1">
                  <button onClick={() => { setProfileOpen(false); navigate("/profile") }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors text-left">
                    <User className="w-3.5 h-3.5 text-zinc-400" /> My Profile
                  </button>
                  <button onClick={() => { setProfileOpen(false); navigate("/preferences") }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-white/[0.05] hover:text-white transition-colors text-left">
                    <Settings className="w-3.5 h-3.5 text-zinc-400" /> Preferences
                  </button>
                </div>
                <div className="border-t border-white/[0.08] pt-1">
                  <button
                    onClick={() => { logout(); navigate("/login"); setProfileOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile nav items strip (when screen is narrow) */}
      <div className="flex md:hidden items-center gap-1.5 mt-2 overflow-x-auto pb-1 px-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.href)

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-colors",
                isActive
                  ? "bg-white text-black font-semibold"
                  : "bg-[#12161F] text-zinc-400 border border-white/[0.06]"
              )}
            >
              <item.icon className="w-3 h-3" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </header>
  )
}
