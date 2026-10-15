import { describe, expect, it } from 'vitest'
import { makeQuestion } from './quiz'
const pool = ['a', 'b', 'c', 'd', 'e'].map(x => ({ id: x, kana: x, en: x.toUpperCase() }))
describe('makeQuestion', () => {
  it('gives 4 unique options including the answer', () => {
    const q = makeQuestion(pool[0], pool, 'kanji-meaning')
    expect(q.options).toHaveLength(4)
    expect(new Set(q.options).size).toBe(4)
    expect(q.options).toContain('A')
  })
})
