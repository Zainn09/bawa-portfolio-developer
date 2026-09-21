"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { BlogMedia } from "@/data/blog";
export default function MediaPicker({
  onChoose,
  onClose,
}: {
  onChoose: (media: BlogMedia) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [media, setMedia] = useState<BlogMedia | null>(null),
    [alt, setAlt] = useState(""),
    [caption, setCaption] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  async function upload(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      setError("Choose an image under 4 MB.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const r = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMedia(d.media);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }
  function submit(e: FormEvent) {
    e.preventDefault();
    if (media && alt.trim())
      onChoose({ ...media, alt: alt.trim(), caption: caption.trim() });
  }
  return (
    <dialog
      className="cms-media-dialog"
      ref={dialog}
      aria-labelledby="cms-media-title"
      onCancel={onClose}
    >
      <form onSubmit={submit}>
        <div className="cms-dialog-heading">
          <h2 id="cms-media-title">Add an image</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image dialog"
          >
            ×
          </button>
        </div>
        <p>
          Choose where the image belongs in the article, then add a description.
        </p>
        <label>
          Image file
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={busy}
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
        <small>
          Up to 4 MB / 24 megapixels. Optimized to WebP. Uploaded files are
          public website assets—not private documents.
        </small>
        {busy && <p role="status">Uploading image…</p>}
        {media?.src && (
          <img
            src={media.src}
            alt="Selected upload preview"
            width={media.width}
            height={media.height}
          />
        )}
        <label>
          Alternative text
          <input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            required
            maxLength={500}
            placeholder="Describe the image for readers who cannot see it"
          />
        </label>
        <label>
          Caption
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={1000}
            placeholder="A short caption, if useful"
          />
        </label>
        {error && (
          <p role="alert" className="cms-error">
            {error}
          </p>
        )}
        <div className="cms-dialog-actions">
          <button type="button" className="cms-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="cms-primary"
            disabled={!media || busy || !alt.trim()}
          >
            Insert image
          </button>
        </div>
      </form>
    </dialog>
  );
}
