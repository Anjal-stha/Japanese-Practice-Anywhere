// Builds src/data/tech.json from scripts/source/tech.txt (hand-curated, pipe-delimited)
import { readFileSync, writeFileSync } from 'node:fs'

const lines = readFileSync(new URL('./source/tech.txt', import.meta.url), 'utf8').split('\n')
const seen = new Set()
const list = []
for (const line of lines) {
  if (!line.trim() || line.startsWith('#')) continue
  const [en, kanji, kana, subcategory, note] = line.split('|').map(s => s.trim())
  if (!en || !kana || !subcategory) throw new Error(`Bad line: ${line}`)
  if (/[\u4e00-\u9fff]/.test(kana)) throw new Error(`Kanji in yomikata: ${line}`)
  const hasKanji = kanji && /[\u4e00-\u9fff]/.test(kanji)
  let id = 't-' + en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  while (seen.has(id)) id += '-2'
  seen.add(id)
  list.push({ id, ...(hasKanji && { kanji }), kana, en, subcategory, ...(note && { note }) })
}
writeFileSync(new URL('../src/data/tech.json', import.meta.url), JSON.stringify(list, null, 1))
console.log(`tech: ${list.length}`)
