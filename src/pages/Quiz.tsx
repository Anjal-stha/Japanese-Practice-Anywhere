import { useMemo, useState } from 'react'
import { useEntries } from '../lib/useEntries'
import { makeQuestion, quizTypes, shuffle, type QuizType } from '../lib/quiz'
import { useProgress } from '../lib/storage'

const ROUND = 10

export default function Quiz() {
  const { entries } = useEntries()
  const [type, setType] = useState<QuizType>('kanji-meaning')
  const [round, setRound] = useState(0)
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const markWrong = useProgress(s => s.markWrong)
  const questions = useMemo(() => {
    void round // bumping `round` deals a fresh set of questions
    if (!entries || entries.length < 4) return []
    return shuffle(entries).slice(0, ROUND).map(e => makeQuestion(e, entries, type))
  }, [entries, type, round])
  if (!entries) return <p className="text-slate-500">Loading…</p>
  const restart = (t = type) => { setType(t); setRound(r => r + 1); setI(0); setScore(0); setPicked(null) }
  const chips = (
    <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
      {quizTypes.map(t => (
        <button key={t.id} onClick={() => restart(t.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${t.id === type ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 shadow-sm'}`}>{t.label}</button>
      ))}
    </div>
  )
  if (entries.length < 4) return <p className="text-slate-500">Not enough entries for a quiz.</p>
  if (i >= questions.length) {
    return (
      <div>{chips}
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Round complete</p>
          <p className="my-2 text-5xl font-bold text-indigo-600">{score} / {questions.length}</p>
          <button onClick={() => restart()} className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white">Play again</button>
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
    <div>
      {chips}
      <div className="mx-auto max-w-xl">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${(i / questions.length) * 100}%` }} />
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
      </div>
    </div>
  )
}
