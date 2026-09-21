"use client";
export default function CycleControl({
  label,
  paused,
  reducedMotion,
  running,
  toggle,
}: {
  label: string;
  paused: boolean;
  reducedMotion: boolean;
  running: boolean;
  toggle: () => void;
}) {
  const name = reducedMotion
    ? `${label} rotation disabled for reduced motion`
    : `${paused ? "Resume" : "Pause"} automatic ${label} rotation`;
  return (
    <button
      type="button"
      className="cycle-control"
      data-running={running}
      onClick={toggle}
      disabled={reducedMotion}
      aria-label={name}
      aria-pressed={paused}
      title={name}
    >
      {paused ? "Resume" : "Pause"}
    </button>
  );
}
