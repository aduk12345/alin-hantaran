export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 16"
      className={`h-4 w-28 text-gold ${className}`}
      fill="none"
      stroke="currentColor"
    >
      <line x1="0" y1="8" x2="46" y2="8" strokeWidth="1" />
      <path d="M60 1.5 L66 8 L60 14.5 L54 8 Z" fill="currentColor" stroke="none" />
      <line x1="74" y1="8" x2="120" y2="8" strokeWidth="1" />
    </svg>
  );
}
