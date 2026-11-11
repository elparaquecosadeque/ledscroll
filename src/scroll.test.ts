import assert from 'node:assert/strict'
import { test } from 'node:test'
import { step } from './scroll.ts'

const boxWidth = 300
const textWidth = 80

test('moves left by speed times elapsed time', () => {
  assert.equal(step(100, -1, 50, 1, boxWidth, textWidth), 50)
})

test('wraps to the right edge when the text has fully left on the left', () => {
  assert.equal(step(-70, -1, 50, 1, boxWidth, textWidth), boxWidth)
})

test('wraps to the left edge when the text has fully left on the right', () => {
  assert.equal(step(290, 1, 50, 1, boxWidth, textWidth), -textWidth)
})

test('stays put when paused', () => {
  assert.equal(step(42, 0, 50, 1, boxWidth, textWidth), 42)
})
