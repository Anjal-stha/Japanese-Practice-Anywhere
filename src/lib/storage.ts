import { create } from 'zustand'

interface Progress { known: Record<string, boolean>; wrong: Record<string, number> }
const KEY = 'jp-progress-v1'
const read = (): Progress => {
  try { return { known: {}, wrong: {}, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return { known: {}, wrong: {} } }
}
interface Store extends Progress {
  toggleKnown(id: string): void
  setKnown(id: string, v: boolean): void
  markWrong(id: string): void
}
export const useProgress = create<Store>((set, get) => {
  const save = () => { try { const { known, wrong } = get(); localStorage.setItem(KEY, JSON.stringify({ known, wrong })) } catch { /* storage unavailable */ } }
  return {
    ...read(),
    toggleKnown: id => { set(s => ({ known: { ...s.known, [id]: !s.known[id] } })); save() },
    setKnown: (id, v) => { set(s => ({ known: { ...s.known, [id]: v } })); save() },
    markWrong: id => { set(s => ({ wrong: { ...s.wrong, [id]: (s.wrong[id] ?? 0) + 1 } })); save() },
  }
})

/** Number of known entries in a category (ids are prefixed by category: n5-…, t-…). */
export const knownCount = (known: Record<string, boolean>, catId: string) => {
  const prefix = catId === 'tech' ? 't-' : `${catId}-`
  return Object.keys(known).filter(k => known[k] && k.startsWith(prefix)).length
}
