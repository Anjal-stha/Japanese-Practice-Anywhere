import { useMemo, useState } from 'react'
import { useEntries } from '../lib/useEntries'
import { useProgress } from '../lib/storage'
import type { Entry } from '../lib/types'

const PAGE = 60
const speak = (t: string) => {
  if (!('speechSynthesis' in window)) return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(t)
  u.lang = 'ja-JP'
  speechSynthesis.speak(u)
}
const label = 'mb-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-400 md:hidden'

function Row({ e }: { e: Entry }) {
  const known = useProgress(s => !!s.known[e.id])
  const toggle = useProgress(s => s.toggleKnown)
  return (
    <article className={`grid grid-cols-2 items-center gap-x-4 gap-y-3 rounded-2xl border p-4 shadow-sm md:grid-cols-3 md:gap-x-6 ${known ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
      <div className="col-span-2 md:order-2 md:col-span-1">
        <div className={label}>Japanese</div>
        <button onClick={() => speak(e.kanji ?? e.kana)} title="Play pronunciation" className="text-left text-4xl font-medium leading-tight md:text-3xl break-words">{e.kanji ?? e.kana}</button>
      </div>
      <div className="md:order-1">
        <div className={label}>English</div>
        <div className="font-medium">{e.en}</div>
        {e.subcategory && <div className="text-xs text-slate-400">{e.subcategory}</div>}
        {e.strokes && <div className="text-xs text-slate-400">{e.strokes} strokes</div>}
      </div>
      <div className="md:order-3">
        <div className={label}>Yomikata</div>
        {e.onyomi ? (
          <div className="space-y-0.5 text-sm">
            {e.onyomi.length > 0 && <div><span className="mr-1 rounded bg-indigo-100 px-1 text-[10px] font-bold text-indigo-700">ON</span>{e.onyomi.join('、')}</div>}
            {e.kunyomi && e.kunyomi.length > 0 && <div><span className="mr-1 rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-700">KUN</span>{e.kunyomi.join('、')}</div>}
          </div>
        ) : (
          <>
            <div>{e.kana}</div>
            {e.note && <div className="text-xs text-slate-400">{e.note}</div>}
          </>
        )}
        <button onClick={() => toggle(e.id)} className={`mt-2 rounded-full px-2.5 py-0.5 text-xs font-medium ${known ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          {known ? '✓ Known' : 'Mark known'}
        </button>
      </div>
    </article>
  )
}

export default function Learn() {
  const { entries } = useEntries()
  const known = useProgress(s => s.known)
  const [q, setQ] = useState('')
  const [sub, setSub] = useState('')
  const [shown, setShown] = useState(PAGE)
  const subs = useMemo(() => [...new Set((entries ?? []).map(e => e.subcategory).filter(Boolean))] as string[], [entries])
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return (entries ?? []).filter(e => (!sub || e.subcategory === sub) && (!s || [e.en, e.kanji, e.kana, e.romaji].some(v => v?.toLowerCase().includes(s))))
  }, [entries, q, sub])
  if (!entries) return <p className="text-slate-500">Loading…</p>
  const done = entries.filter(e => known[e.id]).length
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input value={q} onChange={e => { setQ(e.target.value); setShown(PAGE) }} placeholder="Search English, Japanese, or reading…"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        <span className="shrink-0 text-sm text-slate-500">{done} / {entries.length} known</span>
      </div>
      {subs.length > 0 && (
        <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
          {['', ...subs].map(s => (
            <button key={s} onClick={() => { setSub(s); setShown(PAGE) }} className={`shrink-0 rounded-full px-3 py-1 text-sm ${sub === s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>{s || 'All'}</button>
          ))}
        </div>
      )}
      <div className="mb-2 hidden grid-cols-3 gap-x-6 px-4 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
        <span>English</span><span>Japanese</span><span>Yomikata</span>
      </div>
      <div className="space-y-2">{list.slice(0, shown).map(e => <Row key={e.id} e={e} />)}</div>
      {list.length === 0 && <p className="py-10 text-center text-slate-500">Nothing matches.</p>}
      {shown < list.length && (
        <button onClick={() => setShown(shown + PAGE)} className="mx-auto mt-4 block rounded-xl bg-white px-5 py-2 font-medium shadow-sm">Show more ({list.length - shown} left)</button>
      )}
    </div>
  )
}
