import type { Word } from '../data/words'
import type { WordClass } from '../data/wordClasses'

export const MAX_FAILED_ATTEMPTS = 3

export type Attempt = {
  wordId: string
  word: string
  correctCategory: WordClass
  selectedCategory: WordClass
  correct: boolean
  responseTimeMs: number
  at: number
}

export function selectRound(words: readonly Word[], size = 10, random = Math.random): Word[] {
  return [...words]
    .map(word => ({ word, order: random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, Math.min(size, words.length))
    .map(({ word }) => word)
}

export function createAttempt(word: Word, selectedCategory: WordClass, responseTimeMs: number, at = Date.now()): Attempt {
  return { wordId: word.id, word: word.word, correctCategory: word.category, selectedCategory, correct: word.category === selectedCategory, responseTimeMs, at }
}

export function nextRematchWords(unresolved: readonly Word[], failedAttempts: Readonly<Record<string, number>>): Word[] {
  return unresolved.filter(word => (failedAttempts[word.id] ?? 0) < MAX_FAILED_ATTEMPTS)
}

export function reviewWords(unresolved: readonly Word[], failedAttempts: Readonly<Record<string, number>>): Word[] {
  return unresolved.filter(word => (failedAttempts[word.id] ?? 0) >= MAX_FAILED_ATTEMPTS)
}
