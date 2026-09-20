"use client";
import { useEffect } from "react";
/** Progressive enhancement: readable without JS; no scroll locking or animation library. */
export default function MotionEnhancements() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const configure = () => {
      cleanup();
      if (media.matches) return;
      const selector =
        ".section-heading,.intro-section>div,.trust-badge,.expertise-intro,.capability-list,.theme-workbench,.under-surface,.optimization-copy,.optimization-store,.management-layout>div,.responsive-heading,.about-figure,.about-copy,.contact-callout,.contact-layout,.signature-footer-top,.footer-invitation";
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => !el.closest("#process"));
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.reveal = "visible";
              observer.unobserve(entry.target);
            }
        },
        { threshold: 0.08, rootMargin: "0px 0px -25px 0px" },
      );
      for (const element of elements) {
        if (element.getBoundingClientRect().top > window.innerHeight) {
          element.dataset.reveal = "pending";
          observer.observe(element);
        }
      }
      let frame = 0;
      const progress = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const total =
            document.documentElement.scrollHeight - window.innerHeight;
          document.documentElement.style.setProperty(
            "--reading-progress",
            `${total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0}%`,
          );
        });
      };
      window.addEventListener("scroll", progress, { passive: true });
      const resize = new ResizeObserver(progress);
      resize.observe(document.body);
      progress();
      cleanup = () => {
        observer.disconnect();
        resize.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", progress);
        elements.forEach((el) => delete el.dataset.reveal);
        document.documentElement.style.removeProperty("--reading-progress");
      };
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      cleanup();
      media.removeEventListener("change", configure);
    };
  }, []);
  return null;
}
