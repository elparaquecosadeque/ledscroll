import assert from 'node:assert'
import { step } from './scroll.js'

assert.equal(step(100, -1, 50, 1, 300, 80), 50)    // moves left
assert.equal(step(-70, -1, 50, 1, 300, 80), 300)   // wraps to right edge
assert.equal(step(290, 1, 50, 1, 300, 80), -80)    // wraps to left edge
assert.equal(step(42, 0, 50, 1, 300, 80), 42)      // paused
console.log('scroll ok')
