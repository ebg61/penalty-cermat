import { byCategory, percent } from '../game/statistics'
import type { Attempt } from '../game/session'

export function StatCards({ attempts }: { attempts: Attempt[] }) {
  const correct = attempts.filter(attempt => attempt.correct).length
  const average = attempts.length ? (attempts.reduce((total, attempt) => total + attempt.responseTimeMs, 0) / attempts.length / 1000).toFixed(1).replace('.', ',') : '—'
  return <div className="stat-cards"><div><b>{attempts.length}</b><span>pokusů</span></div><div><b>{percent(attempts)} %</b><span>přesnost</span></div><div><b>{correct}</b><span>gólů</span></div><div><b>{average} s</b><span>průměr</span></div></div>
}

export function CategoryStats({ attempts }: { attempts: Attempt[] }) {
  return <section className="category-stats"><h3>PŘESNOST PODLE SLOVNÍCH DRUHŮ</h3>{byCategory(attempts).map(({ category, value }) => <div key={category}><label>{category}</label><span><i style={{ width: `${value}%` }}/>{attempts.some(attempt => attempt.correctCategory === category) ? `${value} %` : '—'}</span></div>)}</section>
}
