export interface Entry {
  id: string
  kanji?: string
  kana: string
  romaji?: string
  en: string
  jlpt?: string
  onyomi?: string[]
  kunyomi?: string[]
  strokes?: number
  subcategory?: string
  note?: string
}
export interface Category {
  id: string
  title: string
  short: string
  blurb: string
  count: number
  entries: () => Promise<Entry[]>
}
