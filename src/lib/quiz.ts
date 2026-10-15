import type { Entry } from './types'

export type QuizType = 'kanji-reading' | 'kanji-meaning' | 'en-japanese' | 'reading-kanji'
export const quizTypes: { id: QuizType; label: string }[] = [
  { id: 'kanji-reading', label: 'Kanji → Reading' },
  { id: 'kanji-meaning', label: 'Kanji → Meaning' },
  { id: 'en-japanese', label: 'English → Japanese' },
  { id: 'reading-kanji', label: 'Reading → Kanji' },
]
const jp = (e: Entry) => e.kanji ?? e.kana
const prompt: Record<QuizType, (e: Entry) => string> = {
  'kanji-reading': jp, 'kanji-meaning': jp, 'en-japanese': e => e.en, 'reading-kanji': e => e.kana,
}
const answer: Record<QuizType, (e: Entry) => string> = {
  'kanji-reading': e => e.kana, 'kanji-meaning': e => e.en, 'en-japanese': jp, 'reading-kanji': jp,
}
export const shuffle = <T,>(a: T[], rnd = Math.random) => {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] }
  return r
}
export interface Question { entry: Entry; prompt: string; options: string[]; answer: string }
export function makeQuestion(entry: Entry, pool: Entry[], type: QuizType, rnd = Math.random): Question {
  const correct = answer[type](entry)
  const distractors = shuffle(pool, rnd).map(answer[type]).filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)
  return { entry, prompt: prompt[type](entry), answer: correct, options: shuffle([correct, ...distractors], rnd) }
}
