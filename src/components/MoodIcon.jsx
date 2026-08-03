const FACES = {
  bien: (
    <>
      <circle cx="190" cy="210" r="16" fill="#000" />
      <circle cx="322" cy="210" r="16" fill="#000" />
      <path
        d="M180 288c14 28 40 46 76 46s62-18 76-46"
        fill="none"
        stroke="#000"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </>
  ),
  ok: (
    <>
      <circle cx="190" cy="212" r="30" fill="#000" />
      <path d="M164 224a30 30 0 0 0 44 18 34 34 0 0 1-44-18z" fill="#fff" />
      <circle cx="322" cy="212" r="30" fill="#000" />
      <path d="M296 224a30 30 0 0 0 44 18 34 34 0 0 1-44-18z" fill="#fff" />
      <line x1="176" y1="316" x2="336" y2="316" stroke="#000" strokeWidth="18" strokeLinecap="round" />
    </>
  ),
  cansada: (
    <>
      <circle cx="190" cy="212" r="26" fill="#000" />
      <circle cx="190" cy="212" r="12" fill="#fff" />
      <circle cx="322" cy="212" r="26" fill="#000" />
      <circle cx="322" cy="212" r="12" fill="#fff" />
      <path
        d="M176 328c14-24 40-38 80-38s66 14 80 38"
        fill="none"
        stroke="#000"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </>
  ),
};

export default function MoodIcon({ type, className }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <circle cx="286" cy="266" r="230" fill="#fff" stroke="#000" strokeWidth="24" />
      <circle cx="246" cy="236" r="230" fill="#F0CB4E" stroke="#000" strokeWidth="24" />
      {FACES[type]}
    </svg>
  );
}
