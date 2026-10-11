import { WORD_CLASSES, type WordClass } from '../data/wordClasses'

type Feedback = null | { correct: boolean; answer: WordClass; selected: WordClass }
type Props = { feedback: Feedback; word: string; onChoose: (category: WordClass) => void }
const COLORS = ['#f1b337','#ee7058','#b272dd','#398ccc','#19a681','#f1784d','#4aa3a3','#e0558d','#8567cd','#d99b29']

export function CategoryGoal({ feedback, word, onChoose }: Props) {
  const selectedIndex = feedback ? WORD_CLASSES.indexOf(feedback.selected) : 2
  const shotStyle = { '--shot-x': `${(selectedIndex % 5 - 2) * 72}px` } as React.CSSProperties

  return <section className="stadium">
    <img className={'keeper ' + (feedback ? feedback.correct ? 'miss' : 'save' : '')} src="/images/goalkeeper-ready-mobile.png" alt="" aria-hidden="true" />
    <div className="goal" aria-label="Branka s deseti částmi">
      {WORD_CLASSES.map((category, index) => {
        const state = feedback && (category === feedback.answer ? 'right' : feedback.selected === category ? 'wrong' : '')
        return <button key={category} disabled={!!feedback} onClick={() => onChoose(category)} style={{ '--accent': COLORS[index] } as React.CSSProperties} className={'target ' + state}>
          {index + 1}. <span>{category}</span>
        </button>
      })}
    </div>
    <div className="penalty-runup" aria-label={`Slovo k zařazení: ${word}`}>
      <img className={'striker ' + (feedback ? 'kicking' : '')} src="/images/striker-kick-mobile.png" alt="" aria-hidden="true" />
      <div className={'word-ball ' + (feedback ? `shot ${feedback.correct ? 'goal-shot' : 'save-shot'}` : '')} style={shotStyle}>
        <span>{word}</span>
      </div>
    </div>
  </section>
}
