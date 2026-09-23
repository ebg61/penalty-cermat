export const WORD_CLASSES = [
  'Podstatná jména', 'Přídavná jména', 'Zájmena', 'Číslovky', 'Slovesa',
  'Příslovce', 'Předložky', 'Spojky', 'Částice', 'Citoslovce',
] as const
export type WordClass = typeof WORD_CLASSES[number]
