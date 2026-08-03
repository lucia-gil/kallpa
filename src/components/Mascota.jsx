export default function Mascota({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" role="img" aria-label="Alpaquita Kallpa">
      <ellipse cx="22" cy="34" rx="16" ry="15" fill="#F0997B" />
      <ellipse cx="14" cy="18" rx="6" ry="15" fill="#F0997B" transform="rotate(-15 14 18)" />
      <ellipse cx="30" cy="18" rx="6" ry="15" fill="#F0997B" transform="rotate(15 30 18)" />
      <circle cx="17" cy="32" r="2.2" fill="#4A1B0C" />
      <circle cx="27" cy="32" r="2.2" fill="#4A1B0C" />
      <path d="M18 40 Q22 44 26 40" stroke="#4A1B0C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="36" rx="5" ry="3.5" fill="#5DCAA5" opacity="0.4" />
    </svg>
  );
}
