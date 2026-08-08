/** Neo-CYCLONE mark: Halpin QUEUE-style Q (black + old gold). */
export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Neo-CYCLONE"
    >
      <rect width="64" height="64" rx="10" fill="var(--card, #fff)" stroke="color-mix(in oklab, var(--primary) 40%, transparent)" strokeWidth="1.5" />
      <circle cx="32" cy="30" r="20" fill="none" stroke="var(--primary, #C5A572)" strokeWidth="2.8" />
      <circle cx="32" cy="30" r="15" fill="none" stroke="var(--foreground, #1a1a1a)" strokeWidth="6.5" />
      <line
        x1="37"
        y1="35"
        x2="50"
        y2="48"
        stroke="var(--foreground, #1a1a1a)"
        strokeWidth="6.5"
        strokeLinecap="square"
      />
      <path d="M48 46 L54 52 L46.5 51 Z" fill="var(--primary, #C5A572)" />
    </svg>
  );
}
