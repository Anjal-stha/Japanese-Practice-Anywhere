import type { Category, Entry } from '../lib/types'
const load = (p: Promise<{ default: unknown }>) => p.then(m => m.default as Entry[])
export const categories: Category[] = [
  { id: 'n5', title: 'Kanji N5', short: 'N5', blurb: 'Beginner kanji', count: 79, entries: () => load(import('./kanji-n5.json')) },
  { id: 'n4', title: 'Kanji N4', short: 'N4', blurb: 'Elementary kanji', count: 166, entries: () => load(import('./kanji-n4.json')) },
  { id: 'n3', title: 'Kanji N3', short: 'N3', blurb: 'Intermediate kanji', count: 367, entries: () => load(import('./kanji-n3.json')) },
  { id: 'n2', title: 'Kanji N2', short: 'N2', blurb: 'Upper-intermediate kanji', count: 367, entries: () => load(import('./kanji-n2.json')) },
  { id: 'n1', title: 'Kanji N1', short: 'N1', blurb: 'Advanced kanji', count: 1232, entries: () => load(import('./kanji-n1.json')) },
  { id: 'tech', title: 'Tech & CS', short: 'Tech', blurb: 'System design, AI/ML, LLM, dev terms', count: 245, entries: () => load(import('./tech.json')) },
]
