import { useRef, useState } from 'react'
import { useEntries } from '../lib/useEntries'
import { makeQuestion, quizTypes, shuffle, type Question, type QuizType } from '../lib/quiz'
import { useProgress } from '../lib/storage'
import type { Entry } from '../lib/types'

const BATCH = 10

function Session({ entries, type, onRestart }: { entries: Entry[]; type: QuizType; onRestart: () => void }) {
  const asked = useRef(new Set<string>())
  // Deals the next batch, skipping entries already asked; starts over once the category is used up.
  const deal = (): Question[] => {
    let fresh = entries.filter(e => !asked.current.has(e.id))
    if (fresh.length < BATCH) { asked.current.clear(); fresh = entries }
    const batch = shuffle(fresh).slice(0, BATCH)
    batch.forEach(e => asked.current.add(e.id))
    return batch.map(e => makeQuestion(e, entries, type))
  }
  const [questions, setQuestions] = useState(deal)
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const markWrong = useProgress(s => s.markWrong)

  const more = () => setQuestions(qs => [...qs, ...deal()])

  if (i >= questions.length) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-500">Great work — {questions.length} questions done</p>
        <p className="my-2 text-5xl font-bold text-indigo-600">{score} / {questions.length}</p>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <button onClick={more} className="rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white">Generate {BATCH} more</button>
          <button onClick={onRestart} className="rounded-xl bg-slate-100 px-6 py-2.5 font-medium text-slate-700">Start over</button>
        </div>
      </div>
    )
  }
  const q = questions[i]
  const choose = (o: string) => {
    if (picked) return
    setPicked(o)
    if (o === q.answer) setScore(s => s + 1)
    else markWrong(q.entry.id)
  }
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(i / questions.length) * 100}%` }} />
        </div>
        <span className="text-xs text-slate-500">Score {score}</span>
      </div>
      <div className="mb-4 rounded-3xl bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-xs text-slate-400">Question {i + 1} of {questions.length}</p>
        <p className="break-words text-4xl font-medium md:text-5xl">{q.prompt}</p>
      </div>
      <div className="grid gap-2.5">
        {q.options.map(o => {
          const state = !picked ? 'bg-white hover:bg-indigo-50' : o === q.answer ? 'bg-emerald-100 ring-2 ring-emerald-400' : o === picked ? 'bg-rose-100 ring-2 ring-rose-400' : 'bg-white opacity-60'
          return <button key={o} onClick={() => choose(o)} className={`rounded-2xl p-4 text-lg shadow-sm ${state}`}>{o}</button>
        })}
      </div>
      {picked && <button onClick={() => { setI(i + 1); setPicked(null) }} className="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-medium text-white">{i + 1 === questions.length ? 'Finish' : 'Next'}</button>}
      <button onClick={more} className="mx-auto mt-4 block text-sm text-indigo-600">+ Add {BATCH} more questions to this round</button>
    </div>
  )
}

export default function Quiz() {
  const { entries } = useEntries()
  const [type, setType] = useState<QuizType>('kanji-meaning')
  const [run, setRun] = useState(0)
  if (!entries) return <p className="text-slate-500">Loading…</p>
  return (
    <div>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {quizTypes.map(t => (
          <button key={t.id} onClick={() => { setType(t.id); setRun(r => r + 1) }} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${t.id === type ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>{t.label}</button>
        ))}
      </div>
      {entries.length < 4
        ? <p className="text-slate-500">Not enough entries for a quiz.</p>
        : <Session key={`${type}-${run}`} entries={entries} type={type} onRestart={() => setRun(r => r + 1)} />}
    </div>
  )
}
