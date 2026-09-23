import { WORD_CLASSES, type WordClass } from './wordClasses'

export type Word = {
  id: string
  word: string
  category: WordClass
  sourceImage: 'IMG_3071' | 'IMG_3072' | 'IMG_3073' | 'IMG_3074'
}

const make = (category: WordClass, sourceImage: Word['sourceImage'], ...items: string[]): Word[] =>
  items.map(word => ({ id: `${sourceImage}-${word}`.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase(), word, category, sourceImage }))

// Transcribed from the supplied physical cards. Only clearly readable cards are used.
export const WORDS: Word[] = [
  ...make('Citoslovce', 'IMG_3071', 'mňau', 'ham', 'ťuk', 'haf', 'kvak', 'hihi', 'pst', 'bác', 'cink', 'vrků', 'bú', 'hú'),
  ...make('Částice', 'IMG_3071', 'nechť', 'ať', 'kéž'),
  ...make('Spojky', 'IMG_3071', 'a', 'i', 'nebo'),

  ...make('Předložky', 'IMG_3072', 'v', 'do', 'k', 'ze', 'nad', 'za', 's', 'pod', 'před'),
  ...make('Příslovce', 'IMG_3072', 'doma', 'teď', 'vpravo', 'včera', 'zítra', 'pomalu', 'zde', 'ráno', 'ne', 'smutně', 'brzy'),
  ...make('Slovesa', 'IMG_3072', 'skáče', 'koupat se', 'cvrlí', 'myslí', 'maloval', 'plavat', 'syčet', 'zpívat', 'spí', 'vařila', 'vracet'),

  ...make('Slovesa', 'IMG_3073', 'nudit se', 'jíst', 'myslel', 'cvičí', 'platit', 'plavala', 'plete'),
  ...make('Číslovky', 'IMG_3073', 'dvacet', 'milion', 'tisíc', 'dvoje', 'třetí', 'pět set', 'patnáct', 'osm', 'devět', 'mnoho'),
  ...make('Zájmena', 'IMG_3073', 'se', 'já', 'ono', 'my', 'oni', 'vás', 'ona', 'jeho', 'vy', 'ano'),
  ...make('Přídavná jména', 'IMG_3073', 'ostrá', 'veselé', 'levné', 'smutný', 'malý', 'rychlé', 'světlý', 'obyčejný', 'špinavý', 'měkký', 'tvrdá', 'mladá', 'studený', 'nová', 'modrý'),

  ...make('Podstatná jména', 'IMG_3074', 'počítač', 'ježek', 'mýval', 'hasič', 'vrtulník', 'plavání', 'sanitka', 'telefon', 'balón', 'delfín', 'kamion', 'Adam', 'tanec', 'posilovna', 'deník', 'batoh'),
]

export const LOCKED_DATASET_COUNTS: Record<WordClass, number> = {
  'Podstatná jména': 16, 'Přídavná jména': 15, 'Zájmena': 10, 'Číslovky': 10,
  'Slovesa': 18, 'Příslovce': 11, 'Předložky': 9, 'Spojky': 3, 'Částice': 3, 'Citoslovce': 12,
}

/** Throws in development if the approved 107-card source of truth is altered. */
export function assertLockedDataset(words: readonly Word[] = WORDS) {
  if (words.length !== 107) throw new Error(`Locked dataset must contain 107 cards; found ${words.length}.`)
  const counts = Object.fromEntries(WORD_CLASSES.map(category => [category, 0])) as Record<WordClass, number>
  for (const entry of words) {
    if (!WORD_CLASSES.includes(entry.category)) throw new Error(`Invalid category for “${entry.word}”: ${entry.category}`)
    counts[entry.category] += 1
  }
  for (const category of WORD_CLASSES) {
    if (counts[category] !== LOCKED_DATASET_COUNTS[category]) throw new Error(`Locked dataset count for ${category} must be ${LOCKED_DATASET_COUNTS[category]}; found ${counts[category]}.`)
  }
  return counts
}
