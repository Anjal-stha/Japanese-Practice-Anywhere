import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { knownCount, useProgress } from '../lib/storage'

export default function Home() {
  const known = useProgress(s => s.known)
  return (
    <div>
      <section className="mb-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white md:p-10">
        <h1 className="text-2xl font-bold md:text-4xl">日本語 Practice</h1>
        <p className="mt-2 max-w-xl text-indigo-100">Learn JLPT N5–N1 kanji and the Japanese words every developer meets. Read it, quiz yourself, then write it from memory.</p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(c => {
          const k = knownCount(known, c.id)
          const tech = c.id === 'tech'
          return (
            <Link key={c.id} to={`/${c.id}/learn`} className={`group rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tech ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-indigo-600">{tech ? '技' : c.short}</span>
                <span className="text-xs text-slate-500">{k} / {c.count}</span>
              </div>
              <h2 className="mt-3 font-bold">{c.title}</h2>
              <p className="text-sm text-slate-500">{c.blurb}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(k / c.count) * 100}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
