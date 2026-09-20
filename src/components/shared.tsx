"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowUpRight } from "lucide-react";
import { imageVariants } from "@/data/portfolio";
export function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`section-label ${light ? "on-dark" : ""}`}>
      <span />
      {children}
    </div>
  );
}
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={`arrow-link ${className}`} href={href}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
export function SafeImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      className={className}
      src={src || "/images/hero-store-small.webp"}
      srcSet={
        imageVariants[src]
          ? `${imageVariants[src]} 720w, ${src} 1400w`
          : undefined
      }
      sizes="(max-width: 767px) 90vw, (max-width: 1600px) 50vw, 800px"
      alt={alt}
      width="1400"
      height="933"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={(e) => {
        const img = e.currentTarget;
        if (!img.dataset.fallback) {
          img.dataset.fallback = "true";
          img.removeAttribute("srcset");
          img.src = "/images/hero-store-small.webp";
        }
      }}
    />
  );
}
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const active = document.activeElement as HTMLElement;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={onClose}
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        className="icon-button modal-close"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <X size={20} />
      </button>
      {children}
    </dialog>
  );
}
