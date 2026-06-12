export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid place-items-center h-9 w-9">
        <svg viewBox="0 0 40 48" className="h-9 w-9 drop-shadow-[0_4px_14px_rgba(126,211,33,0.45)]">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A3F635" />
              <stop offset="100%" stopColor="#5FB511" />
            </linearGradient>
          </defs>
          <path d="M20 0C9 0 0 8.6 0 19.4 0 31.6 14.5 44.2 18.7 47.4a2 2 0 0 0 2.6 0C25.5 44.2 40 31.6 40 19.4 40 8.6 31 0 20 0Z" fill="url(#lg)" />
          <circle cx="20" cy="19" r="10" fill="#0A0A0A" />
          <path d="M15 19.5l3.5 3.5L25 16" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
      <span className="font-display text-[17px] font-bold tracking-tight leading-none">
        <span className="text-primary">No</span>
        <span className="text-white">Waiting</span>
      </span>
    </span>
  );
}
