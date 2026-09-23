// The supplied photos were reviewed. Cards that were obscured, cropped, or not
// confidently readable are intentionally not present in the production dataset.
export const UNRESOLVED_WORDS: { image: string; reason: string }[] = [
  { image: 'IMG_3071–IMG_3074', reason: 'A few overlapped or cropped cards were excluded rather than guessed.' },
]
