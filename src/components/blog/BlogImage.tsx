"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { BlogMedia } from "@/data/blog";

/** Article-only media: reserved geometry, genuine captures, and an honest missing-image state. */
export default function BlogImage({
  media,
  priority = false,
  caption = false,
  zoom = false,
  className = "",
  sizes = "(max-width: 767px) 90vw, 1100px",
}: {
  media: BlogMedia;
  priority?: boolean;
  caption?: boolean;
  zoom?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    // An eager image may fail before React hydrates and attaches onError.
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, [media.src]);
  const present = !!media.src && !failed;
  const picture = present ? (
    <picture>
      {media.mobileSrc && (
        <source
          media="(max-width: 600px)"
          srcSet={media.mobileSrc}
          width={media.mobileWidth}
          height={media.mobileHeight}
        />
      )}
      {media.avifSrc && <source type="image/avif" srcSet={media.avifSrc} />}
      <img
        ref={imageRef}
        src={media.src}
        srcSet={
          media.smallSrc
            ? `${media.smallSrc} ${media.smallWidth || 720}w, ${media.src} ${media.width}w`
            : undefined
        }
        sizes={sizes}
        width={media.width}
        height={media.height}
        alt={media.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={() => setFailed(true)}
        style={{ objectPosition: media.objectPosition || "center" }}
      />
    </picture>
  ) : (
    <div className="journal-placeholder" role="img" aria-label={media.alt}>
      <ImageIcon size={26} strokeWidth={1} />
      <span>{failed ? "IMAGE UNAVAILABLE" : "PROJECT IMAGE PLACEHOLDER"}</span>
      <strong>
        {failed ? "The capture couldn’t load." : "Room for the real thing."}
      </strong>
      <small>
        {media.width} × {media.height} ·{" "}
        {failed ? "Try reloading this page" : "Approved imagery pending"}
      </small>
    </div>
  );
  return (
    <figure
      className={`journal-image ${className}`}
      style={
        {
          "--image-ratio": `${media.width} / ${media.height}`,
          "--mobile-image-ratio":
            media.mobileWidth && media.mobileHeight
              ? `${media.mobileWidth} / ${media.mobileHeight}`
              : undefined,
        } as CSSProperties
      }
    >
      <div className="journal-image-frame">
        {zoom && present ? (
          <a
            href={media.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full-size image: ${media.alt} (new tab)`}
          >
            {picture}
          </a>
        ) : (
          picture
        )}
      </div>
      {caption && (
        <figcaption>
          <span>
            {present
              ? media.caption || media.alt
              : failed
                ? "The source capture could not be loaded."
                : "Approved project imagery pending. No screenshot is implied."}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
