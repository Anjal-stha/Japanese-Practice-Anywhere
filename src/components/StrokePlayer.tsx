import { useEffect, useRef } from 'react'

interface Props { strokes: string[]; run: number }

/** Draws KanjiVG strokes one after another (stroke order). Changing `run` replays it. */
export default function StrokePlayer({ strokes, run }: Props) {
  const refs = useRef<(SVGPathElement | null)[]>([])
  useEffect(() => {
    const anims: Animation[] = []
    let delay = 150
    strokes.forEach((_, i) => {
      const el = refs.current[i]
      if (!el) return
      const len = el.getTotalLength()
      const dur = Math.min(700, Math.max(280, len * 12))
      el.style.strokeDasharray = `${len}`
      anims.push(el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: dur, delay, fill: 'both', easing: 'ease-in-out' }))
      delay += dur + 120
    })
    return () => anims.forEach(a => a.cancel())
  }, [strokes, run])

  return (
    <svg viewBox="0 0 109 109" className="h-full w-full" role="img" aria-label="Stroke order animation">
      {strokes.map((d, i) => <path key={`g${i}`} d={d} fill="none" stroke="#e2e8f0" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />)}
      {strokes.map((d, i) => (
        <path key={`${run}-${i}`} ref={el => { refs.current[i] = el }} d={d} fill="none" stroke="#4f46e5" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}
