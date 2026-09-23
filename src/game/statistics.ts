import { WORD_CLASSES, type WordClass } from '../data/wordClasses'
import type { Attempt } from './session'
export type WordProgress = { attempts: number; correct: number; mistakes: number; lastAttempted: number; averageResponseTimeMs: number }
export type SavedStats = { attempts: Attempt[]; wordMistakes: Record<string, number>; wordProgress: Record<string, WordProgress> }
const KEY = 'penalty-cermat-stats-v1'
const empty = (): SavedStats => ({ attempts: [], wordMistakes: {}, wordProgress: {} })
export const loadStats = (): SavedStats => { try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); return saved ? { ...empty(), ...saved, wordProgress: saved.wordProgress || {} } : empty() } catch { return empty() } }
export const saveStats = (newAttempts: Attempt[]) => {
  const old = loadStats(); const wordMistakes = { ...old.wordMistakes }; const wordProgress = { ...old.wordProgress }
  newAttempts.forEach(attempt => {
    if (!attempt.correct) wordMistakes[attempt.word] = (wordMistakes[attempt.word] || 0) + 1
    const prior = wordProgress[attempt.word] || { attempts: 0, correct: 0, mistakes: 0, lastAttempted: 0, averageResponseTimeMs: 0 }
    const attempts = prior.attempts + 1
    wordProgress[attempt.word] = { attempts, correct: prior.correct + Number(attempt.correct), mistakes: prior.mistakes + Number(!attempt.correct), lastAttempted: attempt.at, averageResponseTimeMs: Math.round((prior.averageResponseTimeMs * prior.attempts + attempt.responseTimeMs) / attempts) }
  })
  localStorage.setItem(KEY, JSON.stringify({ attempts: [...old.attempts, ...newAttempts].slice(-500), wordMistakes, wordProgress }))
}
export const percent = (attempts: Attempt[]) => attempts.length ? Math.round(attempts.filter(a => a.correct).length / attempts.length * 100) : 0
export const byCategory = (attempts: Attempt[]) => WORD_CLASSES.map(category => ({ category, value: percent(attempts.filter(a => a.correctCategory === category)) })) as { category: WordClass; value: number }[]
