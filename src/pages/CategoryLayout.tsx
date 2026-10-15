import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { useEntries } from '../lib/useEntries'
import { Icon } from '../components/Icons'

const modes = [
  { to: 'learn', label: 'Read', icon: 'read' },
  { to: 'quiz', label: 'Quiz', icon: 'quiz' },
  { to: 'write', label: 'Write', icon: 'write' },
] as const

export default function CategoryLayout() {
  const { category, entries } = useEntries()
  if (!category) return <Navigate to="/" replace />
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{category.title}</h1>
          <p className="text-sm text-slate-500">{category.blurb}{entries && ` · ${entries.length} entries`}</p>
        </div>
        <nav className="hidden rounded-xl bg-slate-200/70 p-1 md:flex">
          {modes.map(m => (
            <NavLink key={m.to} to={m.to} className={({ isActive }) => `flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>
              <Icon name={m.icon} className="h-4 w-4" />{m.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  )
}
