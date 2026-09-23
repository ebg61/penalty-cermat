import { WORD_CLASSES, type WordClass } from '../data/wordClasses'

type Feedback = null | { correct: boolean; answer: WordClass; selected: WordClass }
type Props = { feedback: Feedback; onChoose: (category: WordClass) => void }
const COLORS = ['#f1b337','#ee7058','#b272dd','#398ccc','#19a681','#f1784d','#4aa3a3','#e0558d','#8567cd','#d99b29']

export function CategoryGoal({ feedback, onChoose }: Props) {
  return <section className="stadium">
    <div className={'keeper ' + (feedback ? feedback.correct ? 'miss' : 'save' : '')}>🧤</div>
    <div className="goal" aria-label="Branka s deseti částmi">
      {WORD_CLASSES.map((category, index) => {
        const state = feedback && (category === feedback.answer ? 'right' : feedback.selected === category ? 'wrong' : '')
        return <button key={category} disabled={!!feedback} onClick={() => onChoose(category)} style={{ '--accent': COLORS[index] } as React.CSSProperties} className={'target ' + state}>
          {index + 1}. <span>{category}</span>
        </button>
      })}
    </div>
    {feedback && <div className={'ball-flight ' + (feedback.correct ? 'goal-flight' : 'save-flight')}>⚽</div>}
  </section>
}
