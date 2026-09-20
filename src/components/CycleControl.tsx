"use client";
import { Pause, Play } from "lucide-react";
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
      className={`cycle-control ${running ? "is-running" : ""}`}
      onClick={toggle}
      disabled={reducedMotion}
      aria-label={name}
      aria-pressed={paused}
      title={name}
    >
      <span className="cycle-ring" aria-hidden="true" />
      {paused ? <Play size={12} /> : <Pause size={12} />}
    </button>
  );
}
