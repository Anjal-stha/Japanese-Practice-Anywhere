// Builds src/data/kanji-n{1..5}.json from scripts/source/kanji.json
// Source: github.com/davidluzgouveia/kanji-data (KANJIDIC2-derived, CC BY-SA 4.0)
import { readFileSync, writeFileSync } from 'node:fs'

const src = JSON.parse(readFileSync(new URL('./source/kanji.json', import.meta.url)))
const toKatakana = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60))
const kun = r => r.replace(/^-|-$/g, '').replace(/\.(.+)$/, '($1)').replace(/-/g, '')
const out = { 1: [], 2: [], 3: [], 4: [], 5: [] }

for (const [k, v] of Object.entries(src)) {
  if (!v.jlpt_new) continue
  const on = (v.readings_on ?? []).map(toKatakana)
  const kn = [...new Set((v.readings_kun ?? []).map(kun).filter(Boolean))]
  const meanings = v.meanings.filter(m => !/Radical \(no/i.test(m))
  if (!meanings.length || (!on.length && !kn.length)) continue
  out[v.jlpt_new].push({
    id: `n${v.jlpt_new}-${k.codePointAt(0).toString(16)}`,
    kanji: k,
    kana: [...on, ...kn].join('、'),
    en: meanings.slice(0, 3).join(', '),
    jlpt: `N${v.jlpt_new}`,
    onyomi: on,
    kunyomi: kn,
    strokes: v.strokes,
    _freq: v.freq ?? 9999,
  })
}
for (const n of Object.keys(out)) {
  const list = out[n].sort((a, b) => a._freq - b._freq).map(({ _freq, ...e }) => e)
  writeFileSync(new URL(`../src/data/kanji-n${n}.json`, import.meta.url), JSON.stringify(list))
  console.log(`N${n}: ${list.length}`)
}
