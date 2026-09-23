import { describe, expect, it } from 'vitest'
import { WORDS, assertLockedDataset } from '../data/words'
import { WORD_CLASSES } from '../data/wordClasses'
import { MAX_FAILED_ATTEMPTS, createAttempt, nextRematchWords, reviewWords, selectRound } from './session'

describe('locked dataset', () => {
  it('contains exactly the approved category counts', () => {
    expect(WORDS).toHaveLength(107)
    expect(assertLockedDataset()).toEqual({
      'Podstatná jména': 16, 'Přídavná jména': 15, 'Zájmena': 10, 'Číslovky': 10,
      'Slovesa': 18, 'Příslovce': 11, 'Předložky': 9, 'Spojky': 3, 'Částice': 3, 'Citoslovce': 12,
    })
    expect(WORD_CLASSES).toEqual(['Podstatná jména', 'Přídavná jména', 'Zájmena', 'Číslovky', 'Slovesa', 'Příslovce', 'Předložky', 'Spojky', 'Částice', 'Citoslovce'])
  })
})

describe('Penalty game flow', () => {
  it('creates ten distinct first-round questions', () => {
    const round = selectRound(WORDS, 10, () => .5)
    expect(round).toHaveLength(10)
    expect(new Set(round.map(word => word.id)).size).toBe(10)
  })

  it('keeps only unresolved words in rematches and sends three failures to review', () => {
    const [first, second] = WORDS
    expect(nextRematchWords([first, second], { [first.id]: 1 })).toEqual([first, second])
    expect(nextRematchWords([first, second], { [first.id]: MAX_FAILED_ATTEMPTS })).toEqual([second])
    expect(reviewWords([first, second], { [first.id]: MAX_FAILED_ATTEMPTS })).toEqual([first])
  })

  it('records correct category and response timing on each answer', () => {
    const word = WORDS[0]
    expect(createAttempt(word, word.category, 740, 100)).toMatchObject({ word: word.word, correct: true, responseTimeMs: 740, at: 100 })
  })
})
