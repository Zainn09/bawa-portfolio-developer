"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { track } from "@/lib/analytics";
export default function ArticleTools({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState("");
  const progress = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    track("blog_view", { article: slug });
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const body = document.getElementById("article-body");
        if (!body) return;
        const rect = body.getBoundingClientRect();
        const total = Math.max(1, rect.height - innerHeight * 0.45);
        const value = Math.max(
          0,
          Math.min(1, (innerHeight * 0.3 - rect.top) / total),
        );
        progress.current?.style.setProperty(
          "--reading-progress",
          String(value),
        );
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(frame);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [slug]);
  async function copy() {
    const url = location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setFallback("");
      track("article_interaction", { article: slug, action: "copy_link" });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      setFallback(url);
    }
  }
  return (
    <>
      <div
        ref={progress}
        className="article-reading-progress"
        aria-hidden="true"
      />
      <div className="article-share">
        <button onClick={copy} type="button" aria-label="Copy article link">
          {copied ? <Check size={15} /> : <LinkIcon size={15} />}
          <span role="status">{copied ? "Link copied" : "Copy link"}</span>
        </button>
        {fallback && (
          <label>
            Copy this article URL
            <input
              readOnly
              value={fallback}
              onFocus={(e) => e.target.select()}
            />
          </label>
        )}
      </div>
    </>
  );
}
