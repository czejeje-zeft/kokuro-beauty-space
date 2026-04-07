import './FloatingDecorations.css';

/**
 * Floating aesthetic icons — fixed position, z-index 90
 * Always above page sections, never blocking clicks (pointer-events:none)
 *
 * Layout:   left column (3-8%)  &  right column (92-97%)
 * Spacing:  spread across full page height (8% — 90%)
 * Count:    10 elements — tasteful, not overwhelming
 */
const DECOS = [
  // ── Left side ──────────────────────────────────────────────────────
  {
    emoji: '🦋',
    style: { top: '14%', left: '3.5%' },
    sz: '2.0rem', dur: '8s', delay: '0s', op: 0.65,
  },
  {
    emoji: '✨',
    style: { top: '28%', left: '5%' },
    sz: '1.5rem', dur: '5s', delay: '1.2s', op: 0.55,
    extra: 'sparkle',
  },
  {
    emoji: '🌸',
    style: { top: '45%', left: '2.5%' },
    sz: '1.8rem', dur: '9s', delay: '2.5s', op: 0.60,
  },
  {
    emoji: '💎',
    style: { top: '62%', left: '4.5%' },
    sz: '1.5rem', dur: '7s', delay: '0.8s', op: 0.50,
  },
  {
    emoji: '🌿',
    style: { top: '78%', left: '3%' },
    sz: '1.7rem', dur: '10s', delay: '3.5s', op: 0.45,
  },

  // ── Right side ─────────────────────────────────────────────────────
  {
    emoji: '💅',
    style: { top: '20%', right: '4%' },
    sz: '1.8rem', dur: '7s', delay: '1.8s', op: 0.60,
  },
  {
    emoji: '✨',
    style: { top: '36%', right: '3%' },
    sz: '1.4rem', dur: '4.5s', delay: '0.5s', op: 0.50,
    extra: 'sparkle',
  },
  {
    emoji: '🪷',
    style: { top: '53%', right: '5%' },
    sz: '1.9rem', dur: '8.5s', delay: '2.0s', op: 0.55,
  },
  {
    emoji: '🌙',
    style: { top: '69%', right: '3.5%' },
    sz: '1.6rem', dur: '11s', delay: '4.0s', op: 0.45,
  },
  {
    emoji: '⭐',
    style: { top: '84%', right: '4.5%' },
    sz: '1.5rem', dur: '6s', delay: '1.5s', op: 0.50,
    extra: 'sparkle',
  },
];

export default function FloatingDecorations() {
  return (
    <div className="float-deco-layer" aria-hidden="true">
      {DECOS.map((d, i) => (
        <span
          key={i}
          className={`float-deco${d.extra ? ` ${d.extra}` : ''}`}
          style={{
            ...d.style,
            '--sz':    d.sz,
            '--dur':   d.dur,
            '--delay': d.delay,
            '--op':    d.op,
          }}
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
