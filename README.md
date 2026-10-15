# Japanese-Practice-Anywhere

A frontend-only web app for learning Japanese: JLPT N5–N1 kanji plus a curated Tech & CS vocabulary.
No backend; progress is stored in your browser.

## Categories
Kanji N5, N4, N3, N2, N1 (2,211 kanji) and **Tech & CS** (245 words: system design, ML/AI/LLM/NLP, programming, dev tools).

## Modes
- **Read**: English / Japanese / Yomikata, search, filters, tap to hear pronunciation.
- **Quiz**: four question types (kanji→reading, kanji→meaning, English→Japanese, reading→kanji).
- **Write**: draw the kanji, then watch the animated stroke order; tech words are typed.

## Develop
```bash
npm install
npm run dev
npm test
npm run build
```

## Data
Rebuild the generated JSON in `src/data/` with `node scripts/build-kanji.mjs`, `node scripts/build-tech.mjs` and `node scripts/build-strokes.mjs`.
- Kanji: [kanji-data](https://github.com/davidluzgouveia/kanji-data) (derived from KANJIDIC2, CC BY-SA 4.0)
- Stroke order: [KanjiVG](https://kanjivg.tagaini.net) (CC BY-SA 3.0)
- Tech words: hand-curated in `scripts/source/tech.txt`; readings should be double-checked against a dictionary.
