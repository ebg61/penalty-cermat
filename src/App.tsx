import { useMemo, useState } from 'react'
import type { Word } from './data/words'
import type { WordClass } from './data/wordClasses'
import { CategoryGoal } from './components/CategoryGoal'
import { GameHeader } from './components/GameHeader'
import { CategoryStats, StatCards } from './components/StatisticsPanels'
import { audio, pickRound, ROUND_SIZE } from './game/gameEngine'
import { createAttempt, nextRematchWords, reviewWords, type Attempt } from './game/session'
import { loadStats, percent, saveStats } from './game/statistics'

type Screen = 'home' | 'game' | 'round' | 'final' | 'stats'
type Feedback = null | { correct: boolean; answer: WordClass; selected: WordClass }

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [questions, setQuestions] = useState<Word[]>([])
  const [index, setIndex] = useState(0)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [mistakes, setMistakes] = useState<Word[]>([])
  const [failedAttempts, setFailedAttempts] = useState<Record<string, number>>({})
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [startedAt, setStartedAt] = useState(0)
  const [muted, setMuted] = useState(false)
  const [initialSize, setInitialSize] = useState(ROUND_SIZE)

  const current = questions[index]
  const goals = attempts.filter(attempt => attempt.correct).length
  const saves = attempts.filter(attempt => !attempt.correct).length
  const sessionAccuracy = percent(attempts)
  const averageSeconds = attempts.length ? (attempts.reduce((total, attempt) => total + attempt.responseTimeMs, 0) / attempts.length / 1000).toFixed(1).replace('.', ',') : '0,0'
  const review = reviewWords(mistakes, failedAttempts)
  const stats = useMemo(() => loadStats(), [screen])

  const begin = () => {
    const round = pickRound()
    setQuestions(round); setInitialSize(round.length); setIndex(0); setAttempts([])
    setMistakes([]); setFailedAttempts({}); setStreak(0); setBestStreak(0)
    setFeedback(null); setScreen('game'); setStartedAt(Date.now())
  }

  const finish = () => { saveStats(attempts); setScreen('final') }

  const advance = (nextMistakes = mistakes, nextFailedAttempts = failedAttempts) => {
    setFeedback(null)
    if (index + 1 < questions.length) { setIndex(value => value + 1); setStartedAt(Date.now()); return }
    if (nextRematchWords(nextMistakes, nextFailedAttempts).length) setScreen('round')
    else finish()
  }

  const choose = (selected: WordClass) => {
    if (!current || feedback) return
    audio('kick', muted)
    const attempt = createAttempt(current, selected, Date.now() - startedAt)
    setAttempts(existing => [...existing, attempt])
    setFeedback({ correct: attempt.correct, answer: current.category, selected })
    audio(attempt.correct ? 'goal' : 'save', muted)

    let nextMistakes: Word[]
    let nextFailedAttempts: Record<string, number>
    if (attempt.correct) {
      const nextStreak = streak + 1
      setStreak(nextStreak); setBestStreak(value => Math.max(value, nextStreak))
      nextMistakes = mistakes.filter(word => word.id !== current.id)
      nextFailedAttempts = failedAttempts
      setMistakes(nextMistakes)
    } else {
      setStreak(0)
      nextMistakes = mistakes.some(word => word.id === current.id) ? mistakes : [...mistakes, current]
      nextFailedAttempts = { ...failedAttempts, [current.id]: (failedAttempts[current.id] || 0) + 1 }
      setMistakes(nextMistakes)
      setFailedAttempts(nextFailedAttempts)
    }
    window.setTimeout(() => advance(nextMistakes, nextFailedAttempts), 1100)
  }

  const startRematch = () => {
    const pending = nextRematchWords(mistakes, failedAttempts)
    if (!pending.length) { finish(); return }
    setQuestions(pending); setIndex(0); setFeedback(null); setScreen('game'); setStartedAt(Date.now())
  }

  const header = <GameHeader muted={muted} onHome={() => setScreen('home')} onToggleSound={() => setMuted(value => !value)}/>

  if (screen === 'home') return <main className="app home">{header}<section className="home-hero"><div className="hero-ball">⚽</div><p className="eyebrow">ČESKÝ TRÉNINK</p><h1>PENALTY<br/><em>CERMAT</em></h1><p>Přiřaď slovo do správné části branky a dej gól!</p><button className="primary" onClick={begin}>⚽ HRÁT</button><button className="secondary" onClick={() => setScreen('stats')}>📊 STATISTIKY</button></section><div className="field-lines"/></main>

  if (screen === 'stats') return <main className="app panel">{header}<h2>📊 STATISTIKY</h2><StatCards attempts={stats.attempts}/><CategoryStats attempts={stats.attempts}/><h3>🔄 K OPAKOVÁNÍ</h3><div className="review-list">{Object.entries(stats.wordMistakes).length ? Object.entries(stats.wordMistakes).sort((a, b) => b[1] - a[1]).map(([word, count]) => <p key={word}><b>{word}</b><span>{count}×</span></p>) : <p>Ještě žádné zákroky. Jen tak dál!</p>}</div><button className="primary" onClick={begin}>⚽ HRÁT</button></main>

  if (screen === 'round') {
    const pending = nextRematchWords(mistakes, failedAttempts)
    return <main className="app panel result">{header}<p className="big-icon">🏁</p><p className="eyebrow">KONEC KOLA</p><h2>{goals} / {initialSize}</h2><strong className="accuracy">{sessionAccuracy} % SPRÁVNĚ</strong><div className="scoreline"><span>⚽ Góly: {goals}</span><span>🧤 Zákroky: {saves}</span></div><div className="rematch"><b>🔄 ODVETA</b><p>Máš {pending.length} {penaltyWord(pending.length)} k odvetě!</p></div><button className="primary" onClick={startRematch}>🔄 ODVETA</button></main>
  }

  if (screen === 'final') return <main className="app panel result">{header}<p className="big-icon">🏆</p><p className="eyebrow">VÝSLEDEK</p><h2>{goals} / {initialSize}</h2><strong className="accuracy">{sessionAccuracy} % SPRÁVNĚ</strong><div className="scoreline"><span>⚽ Góly: {goals}</span><span>🧤 Zákroky: {saves}</span><span>🔥 Nejdelší série: {bestStreak}</span><span>⏱ Průměrný čas: {averageSeconds} s</span></div>{review.length ? <div className="review"><h3>⚠️ K OPAKOVÁNÍ</h3>{review.map(word => <span key={word.id}>{word.word}</span>)}</div> : <p className="celebrate">🎉 Všechny penalty zvládnuty!</p>}<button className="primary" onClick={begin}>⚽ HRÁT ZNOVU</button><button className="secondary" onClick={() => setScreen('stats')}>📊 STATISTIKY</button></main>

  return <main className="app game">{header}<div className="scoreboard"><span>{index + 1} / {questions.length}</span><span>⚽ {goals}</span><span>🔥 {streak}</span></div><CategoryGoal feedback={feedback} onChoose={choose}/><section className="word-card"><p>ROZHODNI, KAM PATŘÍ</p><strong>{current?.word}</strong></section>{feedback && <div className={'feedback ' + (feedback.correct ? 'win' : 'lose')}><b>{feedback.correct ? '⚽ GÓÓÓÓÓL!' : '🧤 ZÁSAH!'}</b>{!feedback.correct && <span>Správně: {feedback.answer}</span>}</div>}<p className="hint">Vyber část branky.</p></main>
}

function penaltyWord(count: number) { return count === 1 ? 'penaltu' : count < 5 ? 'penalty' : 'penalt' }
