"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
} from "lucide-react";
import type { RichDoc } from "@/lib/cms/model";
import { safeLink } from "@/lib/cms/model";
import MediaPicker from "./MediaPicker";
const EditorialImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: "", rendered: false },
      layout: { default: null, rendered: false },
      capturedAt: { default: null, rendered: false },
      sourcePath: { default: null, rendered: false },
      width: { default: 1600 },
      height: { default: 1000 },
      smallSrc: { default: null },
      smallWidth: { default: null },
      avifSrc: { default: null },
    };
  },
});
export default function RichEditor({
  value,
  onChange,
  disabled = false,
}: {
  value: RichDoc;
  disabled?: boolean;
  onChange: (doc: RichDoc) => void;
}) {
  const [imageOpen, setImageOpen] = useState(false),
    [linkOpen, setLinkOpen] = useState(false),
    [url, setURL] = useState(""),
    [error, setError] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: false },
      }),
      EditorialImage.configure({ allowBase64: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: "cms-prose-editor",
        role: "textbox",
        "aria-label": "Article content",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getJSON() as RichDoc),
  });
  useEffect(() => {
    editor?.setEditable(!disabled, false);
  }, [editor, disabled]);
  if (!editor)
    return <div className="cms-editor-loading">Loading the writing space…</div>;
  const tools = [
    {
      name: "Bold",
      icon: Bold,
      active: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      name: "Italic",
      icon: Italic,
      active: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      name: "Underline",
      icon: Underline,
      active: editor.isActive("underline"),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      name: "Strikethrough",
      icon: Strikethrough,
      active: editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      name: "Bulleted list",
      icon: List,
      active: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      name: "Numbered list",
      icon: ListOrdered,
      active: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      name: "Quote",
      icon: Quote,
      active: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
  ];
  return (
    <div className="cms-rich-editor">
      <div
        className="cms-editor-toolbar"
        role="toolbar"
        aria-label="Text formatting"
      >
        <select
          aria-label="Text style"
          value={
            editor.isActive("heading")
              ? String(editor.getAttributes("heading").level)
              : "paragraph"
          }
          onChange={(e) =>
            e.target.value === "paragraph"
              ? editor.chain().focus().setParagraph().run()
              : editor
                  .chain()
                  .focus()
                  .setHeading({ level: Number(e.target.value) as 2 | 3 | 4 })
                  .run()
          }
        >
          <option value="paragraph">Paragraph</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>
        {tools.map((t) => (
          <button
            key={t.name}
            type="button"
            title={t.name}
            aria-label={t.name}
            aria-pressed={t.active}
            onClick={t.run}
          >
            <t.icon size={17} />
          </button>
        ))}
        {[
          { name: "left", Icon: AlignLeft },
          { name: "center", Icon: AlignCenter },
          { name: "right", Icon: AlignRight },
        ].map(({ name, Icon }) => (
          <button
            key={name}
            type="button"
            aria-label={`Align ${name}`}
            title={`Align ${name}`}
            aria-pressed={editor.isActive({ textAlign: name })}
            onClick={() => editor.chain().focus().setTextAlign(name).run()}
          >
            <Icon size={17} />
          </button>
        ))}
        <button
          type="button"
          aria-label="Add or edit link"
          title="Add or edit link"
          onClick={() => {
            setURL(editor.getAttributes("link").href || "");
            setLinkOpen((v) => !v);
            setError("");
          }}
        >
          <LinkIcon size={17} />
        </button>
        <button
          type="button"
          aria-label="Remove link"
          title="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          <Unlink size={17} />
        </button>
        <button
          type="button"
          aria-label="Insert image"
          title="Insert image at the cursor"
          onClick={() => setImageOpen(true)}
        >
          <ImagePlus size={17} />
        </button>
        <button
          type="button"
          aria-label="Insert divider"
          title="Insert divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={17} />
        </button>
        <button
          type="button"
          aria-label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </button>
        <button
          type="button"
          aria-label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </button>
      </div>
      {linkOpen && (
        <div className="cms-link-tools">
          <label>
            Link URL
            <input
              type="text"
              value={url}
              onChange={(e) => setURL(e.target.value)}
              placeholder="https://example.com/page"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (!safeLink(url.trim())) {
                setError("Use an HTTPS, HTTP, mailto, or relative link.");
                return;
              }
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url.trim() })
                .run();
              setLinkOpen(false);
            }}
          >
            Apply link
          </button>
          <button type="button" onClick={() => setLinkOpen(false)}>
            Cancel
          </button>
          {error && <span role="alert">{error}</span>}
        </div>
      )}
      <EditorContent editor={editor} />
      <div className="cms-editor-footnote">
        Select text to format it. Place the cursor between paragraphs to insert
        an image. Click an image and press Delete to remove it.
      </div>
      {imageOpen && (
        <MediaPicker
          onClose={() => setImageOpen(false)}
          onChoose={(media) => {
            editor
              .chain()
              .focus()
              .insertContent({ type: "image", attrs: media })
              .run();
            setImageOpen(false);
          }}
        />
      )}
    </div>
  );
}
