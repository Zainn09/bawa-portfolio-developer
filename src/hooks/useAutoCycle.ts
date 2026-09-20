"use client";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";

/** Visible-only, user-controllable two-second cycling. Touch never creates a sticky hover pause. */
export function useAutoCycle(count: number, mobileOnly = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [eligible, setEligible] = useState(!mobileOnly);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const running =
    eligible &&
    visible &&
    documentVisible &&
    !paused &&
    !reducedMotion &&
    !hovered &&
    !focused;
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setReducedMotion(motion.matches);
      setEligible(!mobileOnly || mobile.matches);
    };
    const visibility = () => setDocumentVisible(!document.hidden);
    update();
    visibility();
    motion.addEventListener("change", update);
    mobile.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      mobile.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [mobileOnly]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % count),
      2000,
    );
    return () => window.clearTimeout(timer);
  }, [active, count, running]);
  useEffect(() => {
    const tabs = ref.current?.querySelector<HTMLElement>("[data-cycle-tabs]");
    const selected = tabs?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!visible || !tabs || !selected || tabs.scrollWidth <= tabs.clientWidth)
      return;
    const target =
      tabs.scrollLeft +
      selected.getBoundingClientRect().left -
      tabs.getBoundingClientRect().left -
      (tabs.clientWidth - selected.clientWidth) / 2;
    tabs.scrollTo({
      left: target,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  }, [active, visible, reducedMotion]);
  return {
    ref,
    active,
    setActive,
    paused,
    reducedMotion,
    running,
    eligible,
    toggle: () => setPaused((value) => !value),
    interaction: {
      onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse") setHovered(true);
      },
      onPointerLeave: () => setHovered(false),
      onFocusCapture: (event: FocusEvent<HTMLDivElement>) => {
        if (event.target.matches(":focus-visible")) setFocused(true);
      },
      onBlurCapture: (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      },
    },
  };
}
