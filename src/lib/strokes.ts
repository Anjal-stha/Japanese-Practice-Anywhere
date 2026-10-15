let cache: Promise<Record<string, string[]>> | null = null
/** Lazy-loads the KanjiVG stroke paths (about 2 MB) once. */
export const loadStrokes = () => (cache ??= import('../data/strokes.json').then(m => m.default as Record<string, string[]>))
