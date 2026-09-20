/** Bespoke interlocking AA monogram. The open crossbar doubles as a forward arrow. */
export default function BrandMark({
  className = "",
  size = 38,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={`brand-monogram ${className}`}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 38 19 9 33 38M16 38 30 9 44 38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M12 27h23m-6-5 6 5-6 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
    </svg>
  );
}
