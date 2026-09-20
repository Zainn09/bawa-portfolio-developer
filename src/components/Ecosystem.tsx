"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Plus,
  Pause,
  Play,
  ChevronDown,
} from "lucide-react";
import { platforms } from "@/data/portfolio";
import { SectionLabel } from "./shared";
import { track } from "@/lib/analytics";
const specialties = [
  "Theme",
  "Liquid",
  "Products",
  "Collections",
  "Apps",
  "SEO",
  "CRO",
  "Analytics",
  "Performance",
];
const specialtyNotes: Record<string, string> = {
  Theme:
    "A storefront shaped around the brand, with reusable templates and a considered visual system.",
  Liquid:
    "Shopify’s templating language connects the design to real product data and editable sections.",
  Products:
    "Useful descriptions, consistent imagery, variants, and structured product information make choosing easier.",
  Collections:
    "Thoughtful organization, filters, and navigation help shoppers find their way through the catalog.",
  Apps: "Choose integrations around real business needs, with attention to reliability and storefront performance.",
  SEO: "Search fundamentals connect semantic page structure, metadata, internal links, and useful content.",
  CRO: "Clear information and focused actions reduce friction throughout the shopping journey.",
  Analytics:
    "Consent-aware measurement helps make customer journeys understandable without intrusive tracking.",
  Performance:
    "Lean code, appropriately sized images, and considered loading keep the experience responsive.",
};
type Connection = { name: string; path: string };
export default function Ecosystem() {
  const [selected, setSelected] = useState("Shopify");
  const [view, setView] = useState<"platforms" | "ecosystem">("platforms");
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [sceneSize, setSceneSize] = useState({ width: 700, height: 490 });
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const active = platforms.find((p) => p.name === selected);
  const nodes =
    view === "platforms" ? platforms.map((p) => p.name) : specialties;
  const running =
    visible &&
    documentVisible &&
    !hovered &&
    !focused &&
    !paused &&
    !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReducedMotion(media.matches);
    const visibility = () => setDocumentVisible(!document.hidden);
    preference();
    visibility();
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      const cycle = [
        "Shopify",
        ...(view === "platforms" ? platforms.map((p) => p.name) : specialties),
      ];
      const index = cycle.indexOf(selected);
      if (index === cycle.length - 1) {
        setView((v) => (v === "platforms" ? "ecosystem" : "platforms"));
        setSelected("Shopify");
      } else setSelected(cycle[index + 1]);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [running, selected, view]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = scene.getBoundingClientRect();
        const core = scene
          .querySelector(".shopify-core")
          ?.getBoundingClientRect();
        if (!core || !bounds.width) return;
        const endX = core.left + core.width / 2 - bounds.left;
        const endY = core.top + core.height / 2 - bounds.top;
        setSceneSize({ width: bounds.width, height: bounds.height });
        setConnections(
          Array.from(
            scene.querySelectorAll<HTMLButtonElement>(".platform-node"),
          ).map((node, i) => {
            const rect = node.getBoundingClientRect();
            const x = rect.left + rect.width / 2 - bounds.left;
            const y = rect.top + rect.height / 2 - bounds.top;
            const bend = (i % 2 ? -1 : 1) * 36;
            return {
              name: node.dataset.platform || "",
              path: `M ${x} ${y} Q ${(x + endX) / 2 + bend} ${(y + endY) / 2 - 26} ${endX} ${endY}`,
            };
          }),
        );
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(scene);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [view]);

  function choose(name: string) {
    setSelected(name);
    track("platform_interaction", { platform: name });
  }
  function changeView(next: "platforms" | "ecosystem") {
    setView(next);
    setSelected("Shopify");
  }
  const stateText = reducedMotion
    ? "REDUCED MOTION · MANUAL"
    : paused
      ? "AUTOPLAY PAUSED"
      : hovered
        ? "PAUSED ON HOVER"
        : focused
          ? "PAUSED WHILE EXPLORING"
          : "AUTO EXPLORE · EVERY 2 SECONDS";

  return (
    <section
      className="ecosystem-section"
      id="shopify"
      ref={sectionRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <SectionLabel light>MY CORNER OF COMMERCE / 02</SectionLabel>
            <h2>
              Many platforms.
              <br />
              One deep specialization.
            </h2>
          </div>
          <p className="ecosystem-intro">
            The right platform depends on the business.
            <br />
            Shopify is where I go deep.
          </p>
        </div>
        <div className="ecosystem-toolbar">
          <div
            className="ecosystem-view-tabs"
            aria-label="Commerce ecosystem views"
          >
            <button
              aria-pressed={view === "platforms"}
              onClick={() => changeView("platforms")}
            >
              01 / Platforms
            </button>
            <button
              aria-pressed={view === "ecosystem"}
              onClick={() => changeView("ecosystem")}
            >
              02 / Shopify ecosystem
            </button>
          </div>
          <div className="rotation-controls">
            <span
              className={`rotation-progress ${running ? "running" : ""}`}
              key={`${view}-${selected}-${running}`}
              aria-hidden="true"
            />
            <span>{stateText}</span>
            <button
              className="icon-button"
              disabled={reducedMotion}
              aria-label={
                paused
                  ? "Resume automatic platform rotation"
                  : "Pause automatic platform rotation"
              }
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>
        </div>
        <div className="ecosystem-layout">
          <div
            className="ecosystem-details"
            aria-live={focused || paused ? "polite" : "off"}
          >
            <div className="ecosystem-story" key={`${view}-${selected}`}>
              <span className="mono accent">
                {selected === "Shopify"
                  ? "THE PLATFORM I BUILD ON"
                  : view === "ecosystem"
                    ? "INSIDE THE ECOSYSTEM"
                    : "A DIFFERENT STARTING POINT"}
              </span>
              <h3>{selected === "Shopify" ? "Why Shopify?" : selected}</h3>
              <span className="platform-category">
                {selected === "Shopify"
                  ? "MY SPECIALIZATION"
                  : active?.category || "CONNECTED COMMERCE"}
              </span>
            </div>
            <button
              className="ecosystem-accordion-trigger"
              aria-expanded={expanded}
              aria-controls="ecosystem-explanation"
              onClick={() => setExpanded((e) => !e)}
            >
              The connection to your store <ChevronDown size={16} />
            </button>
            <div
              id="ecosystem-explanation"
              className={`ecosystem-accordion ${expanded ? "expanded" : ""}`}
              inert={!expanded}
            >
              <div>
                <div
                  className="ecosystem-explanation-copy"
                  key={`${view}-${selected}`}
                >
                  <p>
                    {selected === "Shopify"
                      ? "A flexible foundation for considered storefronts. An ecosystem that connects the creative, technical, and everyday sides of a business."
                      : active?.note || specialtyNotes[selected]}
                  </p>
                  <div className="ecosystem-tags">
                    {(selected === "Shopify"
                      ? [
                          "Shopify & Shopify Plus",
                          "Custom themes & Liquid",
                          "SEO, CRO & performance",
                          "Data & store management",
                        ]
                      : [
                          "Thoughtful planning",
                          "Business-first decisions",
                          "Connected workflows",
                        ]
                    ).map((tag) => (
                      <div key={tag}>
                        <ArrowUpRight size={14} />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button
              className="dark-text-link"
              onClick={() =>
                changeView(view === "platforms" ? "ecosystem" : "platforms")
              }
            >
              {view === "platforms"
                ? "Explore the Shopify ecosystem"
                : "See the platform landscape"}
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="orbit-scene" ref={sceneRef}>
            <div className="orbit-glow" />
            <div className="orbit-ring orbit-one" />
            <div className="orbit-ring orbit-two" />
            <div className="orbit-ring orbit-three" />
            <svg
              className="ecosystem-connections"
              viewBox={`0 0 ${sceneSize.width} ${sceneSize.height}`}
              aria-hidden="true"
            >
              {connections.map((line) => (
                <g
                  key={line.name}
                  className={selected === line.name ? "connection-active" : ""}
                >
                  <path className="connection-base" d={line.path} />
                  <path className="connection-flow" d={line.path} />
                </g>
              ))}
            </svg>
            <button
              className={`shopify-core ${selected === "Shopify" ? "selected" : ""}`}
              aria-pressed={selected === "Shopify"}
              onMouseEnter={() => setSelected("Shopify")}
              onClick={() => choose("Shopify")}
            >
              <ShoppingBag size={42} strokeWidth={1.3} />
              <strong>shopify</strong>
              <span>MY SPECIALIZATION</span>
            </button>
            {nodes.map((name, i) => (
              <button
                key={name}
                data-platform={name}
                className={`platform-node node-${i} ${selected === name ? "selected" : ""}`}
                aria-pressed={selected === name}
                title={
                  platforms.find((p) => p.name === name)?.category ||
                  `Explore ${name}`
                }
                onMouseEnter={() => setSelected(name)}
                onFocus={() => setSelected(name)}
                onClick={() => choose(name)}
              >
                <span className="node-symbol">
                  {name === "WooCommerce"
                    ? "woo"
                    : name === "WordPress"
                      ? "W"
                      : name.slice(0, 1)}
                </span>
                {name}
                <Plus size={11} />
              </button>
            ))}
            <div className="orbit-caption">
              <span className="status-dot" /> EVERY CONNECTION. ONE COMMERCE
              EXPERIENCE.
            </div>
          </div>
        </div>
        <div className="ecosystem-bottom">
          <span>NOT A PLATFORM RANKING. A PERSONAL SPECIALIZATION.</span>
          <span>HOVER TO PAUSE · SELECT TO EXPLORE ↗</span>
        </div>
      </div>
    </section>
  );
}
