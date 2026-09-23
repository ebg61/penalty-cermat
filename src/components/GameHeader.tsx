type Props = { muted: boolean; onHome: () => void; onToggleSound: () => void }

export function GameHeader({ muted, onHome, onToggleSound }: Props) {
  return <header>
    <button className="brand" onClick={onHome}>⚽ <span>PENALTY</span> CERMAT</button>
    <button className="sound" onClick={onToggleSound} aria-label="Zapnout nebo vypnout zvuk">{muted ? '🔇' : '🔊'}</button>
  </header>
}
