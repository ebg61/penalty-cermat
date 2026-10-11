export const TOURNAMENT_START_POINTS = 10
export const CORRECT_ANSWER_POINTS = 3
export const WRONG_ANSWER_POINTS = -1

export function updateTournamentPoints(points: number, correct: boolean) {
  return Math.max(0, points + (correct ? CORRECT_ANSWER_POINTS : WRONG_ANSWER_POINTS))
}
