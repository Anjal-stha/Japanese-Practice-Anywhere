import { Navigate, NavLink, Route, Routes, useMatch } from 'react-router-dom'
import { categories } from './data/categories'
import { Icon } from './components/Icons'
import Home from './pages/Home'
import CategoryLayout from './pages/CategoryLayout'
import Learn from './pages/Learn'
import Quiz from './pages/Quiz'
import Write from './pages/Write'

const modes = [
  { to: 'learn', label: 'Read', icon: 'read' },
  { to: 'quiz', label: 'Quiz', icon: 'quiz' },
  { to: 'write', label: 'Write', icon: 'write' },
] as const

function TopBar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
        <NavLink to="/" className="flex shrink-0 items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">日</span>
          <span className="hidden sm:inline">Japanese Practice</span>
        </NavLink>
        <nav className="no-scrollbar flex flex-1 gap-1 overflow-x-auto">
          {categories.map(c => (
            <NavLink key={c.id} to={`/${c.id}/learn`}
              className={({ isActive }) => `shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {c.short}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

function BottomNav() {
  const match = useMatch('/:cat/*')
  const cat = match?.params.cat
  const item = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium'
  const cls = ({ isActive }: { isActive: boolean }) => `${item} ${isActive ? 'text-indigo-600' : 'text-slate-500'}`
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <NavLink to="/" end className={cls}><Icon name="home" />Home</NavLink>
      {cat && modes.map(m => <NavLink key={m.to} to={`/${cat}/${m.to}`} className={cls}><Icon name={m.icon} />{m.label}</NavLink>)}
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen pb-20 md:pb-8">
      <TopBar />
      <main className="mx-auto max-w-5xl px-4 py-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:cat" element={<CategoryLayout />}>
            <Route index element={<Navigate to="learn" replace />} />
            <Route path="learn" element={<Learn />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="write" element={<Write />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
