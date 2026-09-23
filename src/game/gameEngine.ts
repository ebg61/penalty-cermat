import { WORDS, assertLockedDataset, type Word } from '../data/words'
import { selectRound, type Attempt } from './session'

export type { Attempt } from './session'
export const ROUND_SIZE = 10

assertLockedDataset()

export function pickRound(): Word[] {
  // Rotation stays varied while keeping the round deterministic enough to be child-friendly.
  return selectRound(WORDS, ROUND_SIZE)
}

export function audio(kind: 'kick' | 'goal' | 'save' | 'tap', muted: boolean) {
  if (muted || !window.AudioContext) return
  const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain()
  const values = { kick: [140, .07], goal: [660, .18], save: [220, .12], tap: [420, .04] } as const
  osc.frequency.value = values[kind][0]; gain.gain.value = .08
  osc.connect(gain); gain.connect(ctx.destination); osc.start(); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + values[kind][1]); osc.stop(ctx.currentTime + values[kind][1])
}
