import { Fragment, type ReactNode, type CSSProperties } from "react";
import type { RichNode, RichDoc } from "@/lib/cms/model";
import { safeLink, safeImage } from "@/lib/cms/model";
import BlogImage from "./BlogImage";
export function richHeadings(doc: RichDoc) {
  const headings: { id: string; text: string }[] = [];
  function walk(n: RichNode) {
    if (n.type === "heading")
      headings.push({
        id: `rich-heading-${headings.length}`,
        text: (n.content || []).map((c) => c.text || "").join(""),
      });
    n.content?.forEach(walk);
  }
  walk(doc);
  return headings;
}
export default function RichContent({ document }: { document: RichDoc }) {
  let heading = 0;
  function render(n: RichNode, key: string): ReactNode {
    const children = n.content?.map((c, i) => render(c, `${key}-${i}`));
    const align = ["left", "center", "right", "justify"].includes(
      String(n.attrs?.textAlign),
    )
      ? (n.attrs!.textAlign as CSSProperties["textAlign"])
      : undefined;
    const style: CSSProperties = { textAlign: align };
    if (n.type === "text") {
      let text: ReactNode = n.text || "";
      for (const m of n.marks || []) {
        if (m.type === "bold") text = <strong>{text}</strong>;
        else if (m.type === "italic") text = <em>{text}</em>;
        else if (m.type === "underline") text = <u>{text}</u>;
        else if (m.type === "strike") text = <s>{text}</s>;
        else if (m.type === "code") text = <code>{text}</code>;
        else if (m.type === "link" && safeLink(m.attrs?.href))
          text = (
            <a
              href={m.attrs!.href as string}
              rel="noopener noreferrer"
              target="_blank"
            >
              {text}
            </a>
          );
      }
      return <Fragment key={key}>{text}</Fragment>;
    }
    switch (n.type) {
      case "doc":
        return <Fragment key={key}>{children}</Fragment>;
      case "paragraph":
        return (
          <p key={key} style={style}>
            {children?.length ? children : <br />}
          </p>
        );
      case "heading": {
        const id = `rich-heading-${heading++}`;
        return Number(n.attrs?.level) === 3 ? (
          <h3 key={key} id={id} style={style}>
            {children}
          </h3>
        ) : Number(n.attrs?.level) === 4 ? (
          <h4 key={key} id={id} style={style}>
            {children}
          </h4>
        ) : (
          <h2 key={key} id={id} style={style}>
            {children}
          </h2>
        );
      }
      case "bulletList":
        return <ul key={key}>{children}</ul>;
      case "orderedList":
        return <ol key={key}>{children}</ol>;
      case "listItem":
        return <li key={key}>{children}</li>;
      case "blockquote":
        return <blockquote key={key}>{children}</blockquote>;
      case "codeBlock":
        return (
          <pre key={key}>
            <code>{children}</code>
          </pre>
        );
      case "hardBreak":
        return <br key={key} />;
      case "horizontalRule":
        return <hr key={key} />;
      case "image": {
        const a = n.attrs || {};
        if (!safeImage(a.src)) return null;
        const dimension = (v: unknown, fallback: number) =>
          typeof v === "number" && v > 0 && v <= 20000 ? v : fallback;
        return (
          <BlogImage
            key={key}
            media={{
              src: a.src,
              alt: typeof a.alt === "string" ? a.alt : "",
              caption: typeof a.caption === "string" ? a.caption : undefined,
              width: dimension(a.width, 1600),
              height: dimension(a.height, 1000),
              ...(safeImage(a.smallSrc)
                ? {
                    smallSrc: a.smallSrc,
                    smallWidth: dimension(a.smallWidth, 720),
                  }
                : {}),
              ...(safeImage(a.avifSrc) ? { avifSrc: a.avifSrc } : {}),
            }}
            caption={!!a.caption}
            zoom
            sizes="(max-width:767px) 90vw, 760px"
          />
        );
      }
      default:
        return null;
    }
  }
  return <div className="rich-article">{render(document, "body")}</div>;
}
