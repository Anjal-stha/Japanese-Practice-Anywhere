import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { categories } from '../data/categories'
import type { Entry } from './types'

export function useEntries() {
  const { cat } = useParams()
  const category = categories.find(c => c.id === cat)
  const [entries, setEntries] = useState<Entry[] | null>(null)
  useEffect(() => { setEntries(null); category?.entries().then(setEntries) }, [category])
  return { category, entries }
}
