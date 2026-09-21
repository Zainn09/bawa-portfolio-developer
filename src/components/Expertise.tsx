"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  Plus,
  Minus,
  Check,
  Code2,
  Layers3,
  Database,
  ChartNoAxesCombined,
} from "lucide-react";
import { capabilities } from "@/data/portfolio";
import { SectionLabel } from "./shared";
import { useAutoCycle } from "@/hooks/useAutoCycle";
import CycleControl from "./CycleControl";
import Storefront from "./Storefront";
export function Expertise() {
  const [active, setActive] = useState(0);
  return (
    <section className="expertise-section section-pad container" id="expertise">
      <div className="expertise-intro">
        <SectionLabel>THE COMPLETE PICTURE / 03</SectionLabel>
        <h2>
          A Shopify store
          <br />
          is more than
          <br />
          <span className="muted">a theme.</span>
        </h2>
        <p>
          I connect the pieces that make a store work.
          <br />
          For your customers. And for you.
        </p>
        <a className="text-link" href="#contact">
          Find the right starting point <ArrowUpRight size={16} />
        </a>
        <div className="expertise-symbol" aria-hidden="true">
          <Layers3 size={120} strokeWidth={0.6} />
          <span>
            THINK IN SYSTEMS.
            <br />
            CARE ABOUT DETAILS.
          </span>
        </div>
      </div>
      <div className="capability-list">
        {capabilities.map((c, i) => (
          <div
            className={`capability ${active === i ? "expanded" : ""}`}
            key={c.title}
          >
            <button
              aria-expanded={active === i}
              aria-controls={`capability-${i}`}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              <span className="mono">0{i + 1}</span>
              <h3>{c.title}</h3>
              {active === i ? <Minus size={19} /> : <Plus size={19} />}
            </button>
            {active === i && (
              <div id={`capability-${i}`} className="capability-content">
                <p>{c.description}</p>
                <div className="capability-tags">
                  {c.items.map((item) => (
                    <span key={item}>
                      <Check size={12} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
const themeParts = [
  {
    name: "Custom sections",
    file: "sections / editorial-hero.liquid",
    code: `{% for block in section.blocks %}\n  <article class="story-block">\n    {{ block.settings.heading | escape }}\n  </article>\n{% endfor %}`,
    label: "Brand-led sections, built to be edited.",
  },
  {
    name: "Product templates",
    file: "sections / main-product.liquid",
    code: `<h1>{{ product.title | escape }}</h1>\n<p>{{ product.price | money }}</p>\n{% form 'product', product %}\n  <!-- Variant selection + add to cart -->\n{% endform %}`,
    label: "Product information, clearly presented.",
  },
  {
    name: "Collection templates",
    file: "sections / collection-grid.liquid",
    code: `{% paginate collection.products by 12 %}\n  {% for product in collection.products %}\n    {% render 'product-card', product: product %}\n  {% endfor %}\n{% endpaginate %}`,
    label: "A clearer path to the right product.",
  },
  {
    name: "Cart experience",
    file: "snippets / cart-summary.liquid",
    code: `{% for item in cart.items %}\n  <p>{{ item.product.title | escape }}</p>\n  <span>{{ item.quantity }}</span>\n{% endfor %}\n{{ cart.total_price | money }}`,
    label: "Every item. Every detail. One easy bag.",
  },
];
export function CustomTheme() {
  const themeCycle = useAutoCycle(themeParts.length, true);
  const architectureCycle = useAutoCycle(5);
  const { active: part, setActive: setPart } = themeCycle;
  const { active: layer, setActive: setLayer } = architectureCycle;
  const layers = [
    {
      name: "Storefront",
      icon: Layers3,
      text: "The visible experience: navigation, products, collections, and the path to purchase.",
    },
    {
      name: "Theme & Liquid",
      icon: Code2,
      text: "Reusable sections and components connect the visual design to Shopify’s data.",
    },
    {
      name: "Data & metafields",
      icon: Database,
      text: "Structured product content, variants, and custom information power useful experiences.",
    },
    {
      name: "Apps & integrations",
      icon: Layers3,
      text: "Selected integrations connect store workflows without adding unnecessary complexity.",
    },
    {
      name: "SEO & analytics",
      icon: ChartNoAxesCombined,
      text: "Search fundamentals and consent-aware tracking help make the experience discoverable and understandable.",
    },
  ];
  return (
    <section className="theme-section section-pad">
      <div className="container">
        <div className="section-heading">
          <div>
            <SectionLabel>MADE TO FIT / 04</SectionLabel>
            <h2>
              Not another
              <br />
              <span className="muted">theme installation.</span>
            </h2>
          </div>
          <p className="heading-aside">
            Your brand shouldn’t have to fit a template.
            <br />
            The storefront should be built around it.
          </p>
        </div>
        <div className="theme-workbench" ref={themeCycle.ref}>
          <div className="theme-editor" {...themeCycle.interaction}>
            <div className="editor-top">
              <Code2 size={16} />
              <span>THE BUILDING BLOCKS</span>
              <span className="editor-status">CUSTOM BY DESIGN</span>
              <div className="theme-cycle-control">
                <CycleControl label="theme tab" {...themeCycle} />
              </div>
            </div>
            <div className="editor-tabs" data-cycle-tabs>
              {themeParts.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setPart(i)}
                  aria-pressed={part === i}
                  className={part === i ? "active" : ""}
                >
                  {p.name}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
            <div className="code-file">
              <span className="accent">●</span>
              {themeParts[part].file}
            </div>
            <pre>
              <code>
                {themeParts[part].code.split("\n").map((line, i) => (
                  <span key={i}>
                    <i>{i + 1}</i>
                    {line}
                    {"\n"}
                  </span>
                ))}
              </code>
            </pre>
            <div className="code-note">
              ILLUSTRATIVE LIQUID SNIPPETS · NOT A PRODUCTION THEME
            </div>
          </div>
          <div className="theme-render">
            <div className="render-label">
              <span className="status-dot" /> FROM STRUCTURE TO STOREFRONT{" "}
              <ArrowUpRight size={14} />
            </div>
            <Storefront compact highlight={themeParts[part].label} />
          </div>
        </div>
        <div className="under-surface">
          <div>
            <SectionLabel>THE STORE UNDER THE SURFACE</SectionLabel>
            <h3>
              Considered outside.
              <br />
              Connected underneath.
            </h3>
          </div>
          <div className="architecture" ref={architectureCycle.ref}>
            <div className="architecture-tabs" data-cycle-tabs>
              {layers.map((l, i) => (
                <button
                  key={l.name}
                  {...architectureCycle.interaction}
                  className={layer === i ? "active" : ""}
                  onClick={() => setLayer(i)}
                  aria-pressed={layer === i}
                >
                  <l.icon size={17} />
                  <span>{l.name}</span>
                  {i < layers.length - 1 && (
                    <span className="architecture-arrow">→</span>
                  )}
                </button>
              ))}
            </div>
            <div
              className="architecture-description"
              {...architectureCycle.interaction}
            >
              <p aria-live={architectureCycle.running ? "off" : "polite"}>
                {layers[layer].text}
              </p>
              <CycleControl label="architecture icon" {...architectureCycle} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function Optimization() {
  const [active, setActive] = useState(0);
  const layers = [
    {
      name: "Design",
      title: "Look good. Feel like your brand.",
      text: "A clear visual hierarchy, considered spacing, and product imagery that gives your brand room to breathe.",
      label: "Visual hierarchy + considered spacing",
    },
    {
      name: "SEO",
      title: "Give discovery a good foundation.",
      text: "Semantic headings, meaningful metadata, descriptive images, and connected product and collection pages.",
      label: "Semantic structure + product metadata",
    },
    {
      name: "CRO",
      title: "Make the next step feel natural.",
      text: "Useful information, obvious actions, and a focused shopping journey. Better decisions start with less friction.",
      label: "Clear product information + focused CTA",
    },
    {
      name: "Performance",
      title: "Make every interaction feel lighter.",
      text: "Right-sized images, lean assets, and intentional loading keep the experience responsive across real-world connections.",
      label: "Responsive images + lightweight assets",
    },
    {
      name: "Mobile",
      title: "The small screen is a big deal.",
      text: "Touch-friendly controls, readable product information, and layouts designed for the way people actually shop.",
      label: "Touch targets + mobile-first layouts",
    },
  ];
  return (
    <section className="optimization-section section-pad container">
      <div className="optimization-copy">
        <SectionLabel>BEYOND THE SURFACE / 05</SectionLabel>
        <h2>
          Beautiful
          <br />
          is not enough<span className="accent">.</span>
        </h2>
        <div className="optimization-tabs">
          {layers.map((l, i) => (
            <button
              key={l.name}
              className={active === i ? "active" : ""}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="optimization-detail" aria-live="polite">
          <h3>{layers[active].title}</h3>
          <p>{layers[active].text}</p>
        </div>
        <span className="small-note">
          THOUGHTFUL PRACTICES. NO MADE-UP PERFORMANCE CLAIMS.
        </span>
      </div>
      <div
        className={`optimization-store ${active === 4 ? "show-mobile" : ""}`}
      >
        <Storefront
          compact
          highlight={layers[active].label}
          device={active === 4 ? "Mobile" : "Desktop"}
        />
      </div>
    </section>
  );
}
