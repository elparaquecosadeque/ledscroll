import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DEFAULT_LOOK, decodeLook, encodeLook } from './settings.ts'

test('round-trips a look through a share link', () => {
  const look = { ...DEFAULT_LOOK, text: 'HOLA ¿qué tal? #1', dir: 0 as const, glow: true }
  assert.deepEqual(decodeLook(`#${encodeLook(look)}`), look)
})

test('fills missing fields with defaults when the link is partial', () => {
  assert.deepEqual(decodeLook('#s=' + encodeURIComponent('{"text":"HI"}')), { ...DEFAULT_LOOK, text: 'HI' })
})

test('drops unknown keys and wrongly typed values when the link is tampered with', () => {
  const tampered = { text: { evil: true }, dir: 5, size: '999', extra: 'x', color: '#f00' }
  assert.deepEqual(decodeLook('#s=' + encodeURIComponent(JSON.stringify(tampered))), {
    ...DEFAULT_LOOK,
    color: '#f00',
  })
})

test('returns null when the hash has no look or is malformed', () => {
  assert.equal(decodeLook(''), null)
  assert.equal(decodeLook('#other=1'), null)
  assert.equal(decodeLook('#s=%7Bnot-json'), null)
  assert.equal(decodeLook('#s=42'), null)
})
