import { forwardRef, useImperativeHandle, useRef } from 'react'

export interface DrawHandle { clear(): void }
const SIZE = 400

/** Freehand drawing pad (mouse, touch, pen) with guide lines. */
const DrawCanvas = forwardRef<DrawHandle>(function DrawCanvas(_, ref) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const ctx = () => canvas.current!.getContext('2d')!
  useImperativeHandle(ref, () => ({ clear: () => ctx().clearRect(0, 0, SIZE, SIZE) }))
  const pos = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect()
    return [((e.clientX - r.left) * SIZE) / r.width, ((e.clientY - r.top) * SIZE) / r.height] as const
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-slate-200" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-slate-200" />
      <canvas
        ref={canvas} width={SIZE} height={SIZE} className="relative h-full w-full touch-none"
        onPointerDown={e => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drawing.current = true
          const [x, y] = pos(e), c = ctx()
          c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#0f172a'
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.01, y); c.stroke()
        }}
        onPointerMove={e => { if (!drawing.current) return; const [x, y] = pos(e), c = ctx(); c.lineTo(x, y); c.stroke() }}
        onPointerUp={() => { drawing.current = false }}
        onPointerCancel={() => { drawing.current = false }}
      />
    </div>
  )
})
export default DrawCanvas
