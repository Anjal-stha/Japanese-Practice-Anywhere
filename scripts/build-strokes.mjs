// Builds src/data/strokes.json: { kanji: [svgPathD, ...] } in stroke order, for every kanji in N5–N1.
// Source: KanjiVG (CC BY-SA 3.0, Ulrich Apel) — downloaded at build time, not committed.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'

const URL_GZ = 'https://github.com/KanjiVG/kanjivg/releases/download/r20260714/kanjivg-20260714.xml.gz'
const cache = new URL('./source/kanjivg.xml', import.meta.url)
let xml
if (existsSync(cache)) xml = readFileSync(cache, 'utf8')
else {
  const res = await fetch(URL_GZ)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  xml = gunzipSync(Buffer.from(await res.arrayBuffer())).toString('utf8')
}

const wanted = new Set()
for (let n = 1; n <= 5; n++)
  for (const e of JSON.parse(readFileSync(new URL(`../src/data/kanji-n${n}.json`, import.meta.url)))) wanted.add(e.kanji)

const out = {}
for (const m of xml.matchAll(/<kanji id="kvg:kanji_([0-9a-f]{5})">([\s\S]*?)<\/kanji>/g)) {
  const ch = String.fromCodePoint(parseInt(m[1], 16))
  if (!wanted.has(ch)) continue
  out[ch] = [...m[2].matchAll(/<path [^>]*\sd="([^"]+)"/g)].map(p => p[1].replace(/\s+/g, ' '))
}
const missing = [...wanted].filter(k => !out[k])
writeFileSync(new URL('../src/data/strokes.json', import.meta.url), JSON.stringify(out))
console.log(`strokes: ${Object.keys(out).length}/${wanted.size}; missing: ${missing.join('') || 'none'}`)
