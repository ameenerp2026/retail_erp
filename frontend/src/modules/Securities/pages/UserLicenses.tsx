import { useMemo, useState } from 'react'
import {
  Ticket,
  Users,
  Activity,
  CalendarCheck,
  RefreshCcw,
  Search,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  AlertTriangle,
  AlertCircle,
  Info,
  Building2,
  Landmark,
  Boxes,
  Settings2,
  ShieldCheck,
  Warehouse,
  Download,
} from 'lucide-react'

type SessionStatus = 'Active' | 'Idle' | 'Disconnected'
type Device = 'Desktop' | 'Laptop' | 'Tablet' | 'Mobile'

type Session = {
  id: string
  user: string
  employeeId: string
  role: string
  location: string
  loginTime: string
  device: Device
  duration: string
  status: SessionStatus
}

const SESSIONS: Session[] = [
  { id: 's1', user: 'Arjun Mehta', employeeId: 'EMP0195', role: 'Sales Manager', location: 'Chennai HQ', loginTime: '07:12 AM', device: 'Desktop', duration: '5h 20m', status: 'Active' },
  { id: 's2', user: 'Priya Sharma', employeeId: 'EMP0102', role: 'Finance Analyst', location: 'Mumbai HQ', loginTime: '08:10 AM', device: 'Laptop', duration: '4h 22m', status: 'Active' },
  { id: 's3', user: 'Karthik B', employeeId: 'EMP0087', role: 'Inventory Lead', location: 'Bangalore WH', loginTime: '07:45 AM', device: 'Tablet', duration: '4h 45m', status: 'Active' },
  { id: 's4', user: 'Linda Patel', employeeId: 'EMP0089', role: 'HR Coordinator', location: 'Ahmedabad HQ', loginTime: '09:20 AM', device: 'Mobile', duration: '3h 40m', status: 'Active' },
  { id: 's5', user: 'Rohit Das', employeeId: 'EMP0156', role: 'Regional Sales', location: 'Delhi HQ', loginTime: '07:55 AM', device: 'Desktop', duration: '5h 10m', status: 'Active' },
  { id: 's6', user: 'Meena K Nair', employeeId: 'EMP0212', role: 'Customer Admin', location: 'Chennai HQ', loginTime: '06:40 AM', device: 'Laptop', duration: '5h 43m', status: 'Idle' },
  { id: 's7', user: 'Suresh V', employeeId: 'EMP0044', role: 'Security Admin', location: 'Mumbai HQ', loginTime: '08:00 AM', device: 'Desktop', duration: '5h 08m', status: 'Disconnected' },
]

const DEVICE_ICON: Record<Device, typeof Monitor> = {
  Desktop: Monitor,
  Laptop: Laptop,
  Tablet: Tablet,
  Mobile: Smartphone,
}

const STATUS_STYLES: Record<SessionStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-600',
  Idle: 'bg-amber-50 text-amber-600',
  Disconnected: 'bg-rose-50 text-rose-600',
}

const LICENSE_DETAILS: Array<{ label: string; value: string }> = [
  { label: 'Company Name', value: 'RetailShop India Pvt Ltd' },
  { label: 'License Type', value: 'Enterprise' },
  { label: 'License Key', value: 'XXXX-XXXX-XXXX-6742' },
  { label: 'Seats Purchased', value: '150' },
  { label: 'Subscription Start', value: '01 Jan 2026' },
  { label: 'Subscription End', value: '31 Dec 2026' },
  { label: 'Renewal Status', value: 'Auto Renewal Enabled' },
  { label: 'Support Plan', value: 'Premium Support' },
]

const USAGE_STATS: Array<{ label: string; value: string; accent?: 'orange' }> = [
  { label: 'Unused Licences', value: '22' },
  { label: 'Peak Usage Today', value: '58 Users', accent: 'orange' },
  { label: 'Peak This Month', value: '71 Users', accent: 'orange' },
  { label: 'Avg Daily Usage', value: '39 Users' },
]

const ROLE_ALLOCATION: Array<{ label: string; count: number; icon: typeof Users; color: string }> = [
  { label: 'Sales', count: 5, icon: Building2, color: 'bg-blue-50 text-blue-600' },
  { label: 'Finance', count: 29, icon: Landmark, color: 'bg-violet-50 text-violet-600' },
  { label: 'Inventory', count: 35, icon: Boxes, color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Operations', count: 42, icon: Settings2, color: 'bg-amber-50 text-amber-600' },
  { label: 'Security', count: 15, icon: ShieldCheck, color: 'bg-rose-50 text-rose-600' },
  { label: 'Warehouse', count: 20, icon: Warehouse, color: 'bg-sky-50 text-sky-600' },
]

const NOTIFICATIONS: Array<{ type: 'warning' | 'error' | 'info'; text: string }> = [
  { type: 'warning', text: 'License expires in 348 days — valid until 31 Dec 2026' },
  { type: 'error', text: '3 users have reached maximum concurrent session usage' },
  { type: 'info', text: '22 licenses remain unassigned and available for allocation' },
]

const NOTIF_ICON: Record<string, typeof Info> = { warning: AlertTriangle, error: AlertCircle, info: Info }
const NOTIF_STYLE: Record<string, string> = {
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-rose-50 text-rose-600',
  info: 'bg-blue-50 text-blue-600',
}

const BUSINESS_NOTES = [
  'Purchased licenses cover all departments as per current organizational structure.',
  'Concurrent session limit is enforced by the system; additional usage requires a plan upgrade.',
  'License usage is monitored in real time for compliance and audit purposes.',
  'Contact your Account Manager for any license upgrade or renewal request.',
  'License purchase and renewal can only be managed by the Super Admin.',
]

function ProgressBar({ value, max, color = 'navy' }: { value: number; max: number; color?: 'navy' | 'orange' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const barColor = color === 'orange' ? 'bg-orange-500' : 'bg-[#1B2A4A]'
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function UserLicenses() {
  const [sessionQuery, setSessionQuery] = useState('')

  const filteredSessions = useMemo(() => {
    const q = sessionQuery.trim().toLowerCase()
    if (!q) return SESSIONS
    return SESSIONS.filter(
      (s) =>
        s.user.toLowerCase().includes(q) ||
        s.employeeId.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    )
  }, [sessionQuery])

  const activeCount = SESSIONS.filter((s) => s.status === 'Active').length

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1B2A4A]">User Licenses</h1>
          <p className="mt-1 text-sm text-slate-400">
            Monitor purchased licenses, active usage, validity period, and active sessions
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#1B2A4A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#152140]"
        >
          <Download size={15} />
          Export Report
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Purchased Licenses</p>
              <p className="mt-1.5 text-2xl font-semibold text-[#1B2A4A]">150</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Ticket size={16} />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Total Licenses Procured</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Assigned Users</p>
              <p className="mt-1.5 text-2xl font-semibold text-[#1B2A4A]">128</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Users size={16} />
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Currently Assigned</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Concurrent Usage</p>
              <p className="mt-1.5 text-2xl font-semibold text-[#1B2A4A]">42 / 75</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Activity size={16} />
            </span>
          </div>
          <div className="mt-2.5">
            <ProgressBar value={42} max={75} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">License Validity</p>
              <p className="mt-1.5 text-2xl font-semibold text-[#1B2A4A]">31 Dec 2026</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <CalendarCheck size={16} />
            </span>
          </div>
          <span className="mt-2 inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
            Active
          </span>
        </div>
      </div>

      {/* License details + current usage */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1B2A4A]">License Details</h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {LICENSE_DETAILS.map((item) => (
              <div key={item.label}>
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Activity size={15} />
            </span>
            <h2 className="text-sm font-semibold text-[#1B2A4A]">Current Usage</h2>
          </div>

          <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-500">Concurrent Sessions</span>
              <span className="font-semibold text-slate-700">42 / 75</span>
            </div>
            <ProgressBar value={42} max={75} color="navy" />
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">42 of 75 used</span>
              <span className="font-medium text-[#1B2A4A]">56%</span>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-slate-500">Assigned Users</span>
              <span className="font-semibold text-slate-700">128 / 150</span>
            </div>
            <ProgressBar value={128} max={150} color="orange" />
            <div className="mt-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">128 of 150 used</span>
              <span className="font-medium text-orange-500">85%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {USAGE_STATS.map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50 px-3.5 py-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className={`mt-1 text-base font-semibold ${item.accent === 'orange' ? 'text-orange-500' : 'text-[#1B2A4A]'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active sessions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#1B2A4A]">Active Sessions</h2>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
              {activeCount} Sessions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={sessionQuery}
                onChange={(e) => setSessionQuery(e.target.value)}
                placeholder="Search users..."
                className="w-56 rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-[#1B2A4A] focus:ring-2 focus:ring-[#1B2A4A]/10"
              />
            </div>
            <button
              type="button"
              aria-label="Refresh sessions"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                <th className="whitespace-nowrap px-3 py-2">User</th>
                <th className="whitespace-nowrap px-3 py-2">Employee ID</th>
                <th className="whitespace-nowrap px-3 py-2">Role</th>
                <th className="whitespace-nowrap px-3 py-2">Login Location</th>
                <th className="whitespace-nowrap px-3 py-2">Login Time</th>
                <th className="whitespace-nowrap px-3 py-2">Device</th>
                <th className="whitespace-nowrap px-3 py-2">Duration</th>
                <th className="whitespace-nowrap px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((s) => {
                const DeviceIcon = DEVICE_ICON[s.device]
                return (
                  <tr key={s.id} className="border-t border-slate-100 text-sm">
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#043793] text-xs font-semibold text-[#FFFFFF]">
                          {s.user
                            .split(' ')
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </span>
                        <span className="font-medium text-[#1B2A4A]">{s.user}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{s.employeeId}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{s.role}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{s.location}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{s.loginTime}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <DeviceIcon size={13} className="text-slate-400" />
                        {s.device}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-500">{s.duration}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role allocation + notifications */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1B2A4A]">License Allocation by Role</h2>
            <span className="text-xs text-slate-400">128 users assigned</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {ROLE_ALLOCATION.map((role) => {
              const Icon = role.icon
              return (
                <div key={role.label} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${role.color}`}>
                    <Icon size={14} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1B2A4A]">{role.count}</p>
                    <p className="text-[11px] text-slate-400">{role.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-[#1B2A4A]">System Notifications</h2>
          <div className="space-y-3">
            {NOTIFICATIONS.map((n, i) => {
              const Icon = NOTIF_ICON[n.type]
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${NOTIF_STYLE[n.type]}`}>
                    <Icon size={14} />
                  </span>
                  <p className="text-sm text-slate-600">{n.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Business notes */}
      <div className="rounded-2xl border border-blue-100 bg-[#EFF6FF] p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#283593]">Business Rules</h2>
        <ul className="space-y-2">
          {BUSINESS_NOTES.map((note, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#283593]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#283593]" />
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}