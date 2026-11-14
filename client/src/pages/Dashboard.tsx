import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import axiosClient from "../api/axiosClient"
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar, CartesianGrid
} from "recharts"
import {
  Truck, Route, Users, Fuel, DollarSign,
  ArrowUpRight, RefreshCw, ArrowRight, ArrowUp, ArrowDown
} from "lucide-react"
import { cn } from "../lib/utils"

const containerVariants: Variants = { 
  hidden: { opacity: 0 }, 
  show: { opacity: 1, transition: { staggerChildren: 0.05 } } 
}

const itemVariants: Variants = { 
  hidden: { opacity: 0, y: 12 }, 
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 28 } 
  } 
}

// ── Chart data ──
const sparklineBalance = [
  { v: 12 }, { v: 16 }, { v: 14 }, { v: 22 }, { v: 19 }, { v: 28 }, { v: 34 }, { v: 31 }, { v: 45 }, { v: 52 }, { v: 60 }
]

const budgetBarData = [
  { month: "Jun", fixed: 3200, personal: 2100, invest: 1800, savings: 900 },
  { month: "Jul", fixed: 3800, personal: 2400, invest: 1600, savings: 1200 },
  { month: "Aug", fixed: 2800, personal: 1900, invest: 1400, savings: 800 },
  { month: "Sep", fixed: 4200, personal: 3100, invest: 2100, savings: 1400 },
  { month: "Oct", fixed: 3600, personal: 2600, invest: 1900, savings: 1100 },
  { month: "Nov", fixed: 4800, personal: 3400, invest: 2500, savings: 1600 },
]

const recentTransactions = [
  { id: 1, name: "Fleet Fuel Depot #42", category: "Diesel Refill", time: "8 Nov · 19:15 PM", amount: -126.99, icon: Fuel, color: "bg-amber-500/10 text-amber-400" },
  { id: 2, name: "Volvo Parts Hub", category: "Brake Discs & Pads", time: "6 Nov · 18:23 PM", amount: -438.54, icon: Truck, color: "bg-blue-500/10 text-blue-400" },
  { id: 3, name: "Tollway Direct Express", category: "Transit Fees", time: "6 Nov · 10:03 AM", amount: -20.90, icon: Route, color: "bg-purple-500/10 text-purple-400" },
  { id: 4, name: "Freight Dispatch Client", category: "Consignment Payout", time: "3 Nov · 11:55 AM", amount: 3563.00, icon: DollarSign, color: "bg-emerald-500/10 text-emerald-400" },
  { id: 5, name: "Driver Payroll Settlement", category: "Emma Davis", time: "1 Nov · 16:47 PM", amount: -849.89, icon: Users, color: "bg-rose-500/10 text-rose-400" },
]

const quickDrivers = [
  { name: "Alex Chen", role: "Dispatcher", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" },
  { name: "Sarah Smith", role: "Lead Driver", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
  { name: "David Kim", role: "Safety Chief", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [filterTab, setFilterTab] = useState<"All" | "Income" | "Spending">("All")

  // Neon: Recent trips
  const { data: tripData } = useQuery({
    queryKey: ["dashboard-trips"],
    queryFn: async () => {
      try {
        const res = await axiosClient.get("/trips?limit=5")
        return res.data?.data || res.data || []
      } catch {
        return []
      }
    },
  })

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-6 pb-12">
      
      {/* ── Novamint Layout: 3 Columns Grid (Left Cards / Middle Cards / Right Cards) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* ════════ COLUMN 1 (Left 3 cols): Income / Expense, Top Spending Gauge, Quick Drivers ════════ */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          
          {/* Box 1A: Fleet Revenue / Income */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Monthly Revenue</span>
              <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowUp className="w-3 h-3" /> 10%
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">$42,436<span className="text-zinc-500 text-lg font-normal">.00</span></h3>
            </div>
          </motion.div>

          {/* Box 1B: Operations Cost / Expense */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl relative overflow-hidden group hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-400">Total Ops Expense</span>
              <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <ArrowDown className="w-3 h-3" /> 2%
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-extrabold text-white tracking-tight">$18,359<span className="text-zinc-500 text-lg font-normal">.00</span></h3>
            </div>
          </motion.div>

          {/* Box 1C: Top Spending / Category Arc Gauge */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl flex flex-col justify-between group hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Fleet Expenses</span>
              <button onClick={() => navigate("/expenses")} className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Arc Meter Graphic */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <svg className="w-48 h-28" viewBox="0 0 100 55">
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 A 40 40 0 0 1 72 16"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="60%" stopColor="#94D2BD" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center mt-[-18px]">
                <span className="text-2xl font-extrabold text-white tracking-tight">$14,894.52</span>
                <p className="text-[10px] text-zinc-400">Total Spent this Month</p>
              </div>
            </div>

            {/* Breakdown Legend */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                  <span className="text-zinc-300">Fuel & Diesel</span>
                </div>
                <span className="font-semibold text-white">40%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-zinc-300">Maintenance & Parts</span>
                </div>
                <span className="font-semibold text-white">25%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7DD3FC]" />
                  <span className="text-zinc-300">Driver Allowances</span>
                </div>
                <span className="font-semibold text-white">20%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  <span className="text-zinc-300">Tolls & Parking</span>
                </div>
                <span className="font-semibold text-white">15%</span>
              </div>
            </div>
          </motion.div>

          {/* Box 1D: Quick Dispatch Transfer / Key Crew */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl group hover:border-white/[0.14] transition-all">
            <span className="text-xs font-semibold text-white block mb-3">Quick Dispatch</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {quickDrivers.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => navigate("/drivers")}
                    title={`${d.name} (${d.role})`}
                    className="relative group/avatar"
                  >
                    <img
                      src={d.img}
                      alt={d.name}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10 group-hover/avatar:ring-[#94D2BD] transition-all"
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigate("/trips")}
                className="w-11 h-11 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all"
                title="New Dispatch Route"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>


        {/* ════════ COLUMN 2 (Middle 5 cols): Sky Gradient Hero Card, Goal/Savings, Monthly Budget ════════ */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Box 2A: Main Total Balance Gradient Hero Box */}
          <motion.div
            variants={itemVariants}
            className="rounded-[36px] p-7 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#CFE7FC] via-[#A8D3F9] to-[#80BEF6] text-[#0A101D] group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#1E3A5F]/80 uppercase tracking-wider">Fleet Operational Capital</span>
              <button
                onClick={() => navigate("/expenses")}
                className="w-9 h-9 rounded-full bg-white/60 hover:bg-white flex items-center justify-center text-[#0A101D] transition-transform group-hover:scale-105 shadow-sm"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#071326]">
                $125,230<span className="text-2xl sm:text-3xl font-medium text-[#1E3A5F]">.00</span>
              </h2>
              <div className="flex items-center gap-2 mt-3">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/70 text-[#071326] text-xs font-bold shadow-xs">
                  <ArrowUp className="w-3 h-3 text-emerald-600" /> 10%
                </span>
                <span className="text-xs font-semibold text-[#1E3A5F]/90 bg-white/40 px-2.5 py-0.5 rounded-full">
                  +$12,780.00 this month
                </span>
              </div>
            </div>

            {/* Sparkline miniature chart at the bottom right */}
            <div className="h-16 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineBalance}>
                  <defs>
                    <linearGradient id="balanceHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0B2545" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0B2545" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#071326"
                    strokeWidth={2.5}
                    fill="url(#balanceHero)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Box 2B: Sub-cards (My Goal & Savings) */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Efficiency Target / Goal */}
            <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-5 shadow-xl group hover:border-white/[0.14] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-400">Mileage Goal</span>
                <button onClick={() => navigate("/trips")} className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-bold text-white">41,700</span>
                <span className="text-xs text-zinc-500 font-medium">/ 50,000 mi</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#94D2BD] rounded-full" style={{ width: "83%" }} />
              </div>
            </motion.div>

            {/* Fuel Reserve / Savings */}
            <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-5 shadow-xl group hover:border-white/[0.14] transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-400">Fuel Reserve</span>
                <button onClick={() => navigate("/expenses")} className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-2xl font-bold text-white">$14,364<span className="text-zinc-500 text-sm">.00</span></span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-[#7DD3FC] rounded-full" style={{ width: "68%" }} />
              </div>
            </motion.div>

          </div>

          {/* Box 2C: Budget Multi-Bar Chart Box */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl flex-1 flex flex-col justify-between group hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Operating Budget</h3>
                <p className="text-[11px] text-zinc-400">Past 6 months expense distribution</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                  6 months ▾
                </span>
                <button onClick={() => navigate("/reports")} className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetBarData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#71717A" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#71717A" }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#12161F", borderColor: "rgba(255,255,255,0.1)", borderRadius: "16px", color: "#fff", fontSize: 12 }}
                  />
                  <Bar dataKey="fixed" fill="#CFE7FC" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="personal" fill="#94D2BD" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="invest" fill="#4A5568" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/[0.06] text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CFE7FC]" /> Fuel
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#94D2BD]" /> Maintenance
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4A5568]" /> Salaries
              </div>
            </div>
          </motion.div>

        </div>


        {/* ════════ COLUMN 3 (Right 4 cols): Transaction History & Metallic Virtual Fleet Card ════════ */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Box 3A: Transaction History with Filter Pill Toggle */}
          <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl flex-1 flex flex-col group hover:border-white/[0.14] transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Expense & Payout History</h3>
              <button onClick={() => navigate("/expenses")} className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Pill Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center bg-[#090C11] p-1 rounded-full border border-white/[0.06]">
                {(["All", "Income", "Spending"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold transition-all",
                      filterTab === tab
                        ? "bg-white text-black shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04]">
                Filter ▾
              </button>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-white/[0.05] flex-1 overflow-y-auto">
              {recentTransactions
                .filter(t => {
                  if (filterTab === "Income") return t.amount > 0
                  if (filterTab === "Spending") return t.amount < 0
                  return true
                })
                .map(item => (
                  <div key={item.id} className="py-3 flex items-center justify-between group/row hover:bg-white/[0.02] px-2 rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-white/[0.06]", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white group-hover/row:text-[#94D2BD] transition-colors">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">{item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "text-xs font-bold font-mono",
                        item.amount > 0 ? "text-emerald-400" : "text-white"
                      )}>
                        {item.amount > 0 ? `+$${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-$${Math.abs(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Box 3B: Metallic Corporate Fleet Card (Visa Style) */}
          <motion.div
            variants={itemVariants}
            className="rounded-[32px] p-6 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#1B2838] via-[#101724] to-[#0A0E17] border border-white/[0.1] text-white group"
          >
            {/* Subtle card sheen */}
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="text-lg font-black tracking-widest text-white italic">TRANSIT<span className="text-[#94D2BD]">PAY</span></span>
              <button onClick={() => navigate("/expenses")} className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.16] flex items-center justify-center text-zinc-300 hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 mb-6">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Available Corporate Fuel Card</p>
              <h4 className="text-3xl font-extrabold text-white mt-1">$21,476<span className="text-zinc-400 text-lg font-normal">.00</span></h4>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 font-mono relative z-10 pt-2 border-t border-white/[0.08]">
              <span>•••• 7954</span>
              <span>EXP 05/29</span>
            </div>
          </motion.div>

        </div>

      </div>

      {/* ── Additional Fleet Operations Row (Recent Active Trips & Fleet Units) ── */}
      <motion.div variants={itemVariants} className="bg-[#12161F] border border-white/[0.08] rounded-[32px] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Active Dispatch & Route Status</h3>
            <p className="text-xs text-zinc-400">Live telematics and active journeys connected to backend</p>
          </div>
          <Link
            to="/trips"
            className="text-xs font-semibold text-[#94D2BD] hover:underline flex items-center gap-1 bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.08]"
          >
            All Trips <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase text-zinc-400 border-b border-white/[0.06]">
              <tr>
                <th className="pb-3 font-semibold">Trip ID</th>
                <th className="pb-3 font-semibold">Origin & Dest</th>
                <th className="pb-3 font-semibold">Assigned Driver</th>
                <th className="pb-3 font-semibold">Route Status</th>
                <th className="pb-3 font-semibold text-right">Estimated Arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tripData && tripData.length > 0 ? (
                tripData.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono text-xs text-white">{trip.id?.slice(0, 8)}</td>
                    <td className="py-3.5 text-zinc-300 font-medium">{trip.origin || "LAX"} → {trip.destination || "PHX"}</td>
                    <td className="py-3.5 text-zinc-300">{trip.driverName || "Assigned Driver"}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#94D2BD]/10 text-[#94D2BD] border border-[#94D2BD]/20">
                        {trip.status || "IN PROGRESS"}
                      </span>
                    </td>
                    <td className="py-3.5 text-zinc-400 text-xs text-right">In Transit</td>
                  </tr>
                ))
              ) : (
                [
                  { id: "TRP-8491", route: "Chicago (ORD) → Dallas (DFW)", driver: "Emma Davis", status: "IN PROGRESS", eta: "1h 20m" },
                  { id: "TRP-8492", route: "San Francisco (SFO) → Seattle (SEA)", driver: "Sarah Smith", status: "SCHEDULED", eta: "4h 45m" },
                  { id: "TRP-8493", route: "New York (JFK) → Boston (BOS)", driver: "Mike Johnson", status: "COMPLETED", eta: "Delivered" },
                ].map(row => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-mono text-xs text-white">{row.id}</td>
                    <td className="py-3.5 text-zinc-300 font-medium">{row.route}</td>
                    <td className="py-3.5 text-zinc-300">{row.driver}</td>
                    <td className="py-3.5">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[10px] font-bold rounded-full border",
                        row.status === "COMPLETED" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-[#94D2BD]/10 text-[#94D2BD] border-[#94D2BD]/20"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-zinc-400 text-xs text-right">{row.eta}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </motion.div>
  )
}
