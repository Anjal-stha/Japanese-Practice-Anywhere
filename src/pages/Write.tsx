import { useEffect, useMemo, useRef, useState } from 'react'
import { useEntries } from '../lib/useEntries'
import { shuffle } from '../lib/quiz'
import { loadStrokes } from '../lib/strokes'
import { useProgress } from '../lib/storage'
import DrawCanvas, { type DrawHandle } from '../components/DrawCanvas'
import StrokePlayer from '../components/StrokePlayer'
import type { Entry } from '../lib/types'

type Strokes = Record<string, string[]>
const toKatakana = (s: string) => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
const norm = (s: string) => toKatakana(s.normalize('NFKC').replace(/[\s・･]/g, '')).toLowerCase()

function Prompt({ e }: { e: Entry }) {
  return (
    <div className="mb-4 text-center">
      <p className="text-2xl font-bold">{e.en}</p>
      <p className="text-slate-500">{e.onyomi ? `${e.onyomi.join('、')}${e.kunyomi?.length ? ' ・ ' + e.kunyomi.join('、') : ''}` : e.kana}</p>
    </div>
  )
}

function DrawCard({ e, strokes, onDone }: { e: Entry; strokes: string[]; onDone: (ok: boolean) => void }) {
  const pad = useRef<DrawHandle>(null)
  const [phase, setPhase] = useState<'draw' | 'review'>('draw')
  const [hint, setHint] = useState(false)
  const [run, setRun] = useState(0)
  const showRef = phase === 'review' || hint
  return (
    <div>
      <Prompt e={e} />
      <div className={`mx-auto grid max-w-2xl gap-4 ${showRef ? 'sm:grid-cols-2' : 'max-w-sm'}`}>
        <div>
          <p className="mb-1 text-center text-xs font-medium text-slate-400">Your drawing</p>
          <DrawCanvas ref={pad} />
        </div>
        {showRef && (
          <div>
            <p className="mb-1 text-center text-xs font-medium text-slate-400">Stroke order · {strokes.length} strokes</p>
            <div className="aspect-square w-full rounded-2xl border border-indigo-200 bg-white p-2 shadow-sm">
              <StrokePlayer strokes={strokes} run={run} />
            </div>
          </div>
        )}
      </div>
      <div className="mx-auto mt-4 flex max-w-sm flex-wrap justify-center gap-2">
        {phase === 'draw' ? (
          <>
            <button onClick={() => pad.current?.clear()} className="rounded-xl bg-white px-4 py-2 font-medium shadow-sm">Clear</button>
            <button onClick={() => { setHint(true); setRun(r => r + 1) }} className="rounded-xl bg-white px-4 py-2 font-medium text-indigo-600 shadow-sm">Hint ▶</button>
            <button onClick={() => { setPhase('review'); setRun(r => r + 1) }} className="rounded-xl bg-indigo-600 px-5 py-2 font-medium text-white">Check</button>
          </>
        ) : (
          <>
            <button onClick={() => setRun(r => r + 1)} className="rounded-xl bg-white px-4 py-2 font-medium text-indigo-600 shadow-sm">↻ Replay</button>
            <button onClick={() => onDone(false)} className="rounded-xl bg-rose-100 px-4 py-2 font-medium text-rose-700">Missed it</button>
            <button onClick={() => onDone(true)} className="rounded-xl bg-emerald-600 px-4 py-2 font-medium text-white">Got it</button>
          </>
        )}
      </div>
    </div>
  )
}

function TypeCard({ e, onDone }: { e: Entry; onDone: (ok: boolean) => void }) {
  const [val, setVal] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const check = () => {
    const v = norm(val)
    if (v) setResult([e.kanji, e.kana].some(a => a && norm(a) === v))
  }
  return (
    <div className="mx-auto max-w-md text-center">
      <p className="mb-1 text-2xl font-bold">{e.en}</p>
      <p className="mb-4 text-sm text-slate-500">Type it in Japanese (kana or kanji){e.subcategory && ` · ${e.subcategory}`}</p>
      <input value={val} onChange={ev => setVal(ev.target.value)} onKeyDown={ev => ev.key === 'Enter' && !ev.nativeEvent.isComposing && (result === null ? check() : onDone(result))}
        disabled={result !== null} autoFocus lang="ja" placeholder="日本語…"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-2xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
      {result !== null && (
        <div className={`mt-4 rounded-2xl p-4 ${result ? 'bg-emerald-100' : 'bg-rose-100'}`}>
          <p className="font-bold">{result ? 'Correct!' : 'Not quite'}</p>
          <p className="text-3xl">{e.kanji ?? e.kana}</p>
          {e.kanji && <p className="text-slate-600">{e.kana}</p>}
          {e.note && <p className="mt-1 text-sm text-slate-500">{e.note}</p>}
        </div>
      )}
      <div className="mt-4">
        {result === null
          ? <button onClick={check} className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white">Check</button>
          : <button onClick={() => onDone(result)} className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white">Next</button>}
      </div>
    </div>
  )
}

export default function Write() {
  const { entries } = useEntries()
  const { setKnown, markWrong } = useProgress()
  const [strokes, setStrokes] = useState<Strokes | null>(null)
  const [i, setI] = useState(0)
  const [correct, setCorrect] = useState(0)
  const deck = useMemo(() => (entries ? shuffle(entries) : []), [entries])
  useEffect(() => { loadStrokes().then(setStrokes) }, [])
  if (!entries || !strokes) return <p className="text-slate-500">Loading…</p>
  if (i >= deck.length) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-4xl font-bold text-indigo-600">{correct} / {deck.length}</p>
        <button onClick={() => { setI(0); setCorrect(0) }} className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white">Go again</button>
      </div>
    )
  }
  const e = deck[i]
  const done = (ok: boolean) => {
    if (ok) { setKnown(e.id, true); setCorrect(c => c + 1) } else markWrong(e.id)
    setI(i + 1)
  }
  const s = e.kanji ? strokes[e.kanji] : undefined
  return (
    <div>
      <p className="mb-3 text-center text-xs text-slate-400">{i + 1} / {deck.length}</p>
      {s ? <DrawCard key={e.id} e={e} strokes={s} onDone={done} /> : <TypeCard key={e.id} e={e} onDone={done} />}
    </div>
  )
}
