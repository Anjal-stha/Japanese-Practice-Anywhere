import { Link } from 'react-router-dom'
import { useEntries } from '../lib/useEntries'

export default function CategoryPage() {
  const { category, entries } = useEntries()
  if (!category) return <p>Unknown category</p>
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{category.title}</h1>
      <p className="mb-4 text-slate-500">{entries ? `${entries.length} entries` : 'Loading…'}</p>
      <div className="grid gap-3">
        {['learn', 'quiz', 'write'].map(m => (
          <Link key={m} to={m} className="rounded-xl bg-white p-4 font-bold capitalize shadow">{m === 'learn' ? 'Read' : m}</Link>
        ))}
      </div>
    </div>
  )
}
