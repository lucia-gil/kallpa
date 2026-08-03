export default function Mascota({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" role="img" aria-label="Alpaquita Kallpa">
      <ellipse cx="30" cy="34" rx="16" ry="15" fill="#F0997B" />
      <ellipse cx="22" cy="18" rx="6" ry="15" fill="#F0997B" transform="rotate(-15 22 18)" />
      <ellipse cx="38" cy="18" rx="6" ry="15" fill="#F0997B" transform="rotate(15 38 18)" />
      <circle cx="25" cy="32" r="2.2" fill="#4A1B0C" />
      <circle cx="35" cy="32" r="2.2" fill="#4A1B0C" />
      <path d="M26 40 Q30 44 34 40" stroke="#4A1B0C" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="36" rx="5" ry="3.5" fill="#5DCAA5" opacity="0.4" />
    </svg>
  );
}