"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Monitor,
  Smartphone,
  RotateCcw,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { storeConcepts } from "@/data/atelier";
import { track } from "@/lib/analytics";
import Storefront from "./Storefront";
import { SectionLabel } from "./shared";

export default function CommerceAtelier() {
  const [direction, setDirection] = useState(0);
  const [device, setDevice] = useState("Desktop");
  const [layout, setLayout] = useState("Editorial");
  const concept = storeConcepts[direction];
  function choose(index: number) {
    setDirection(index);
    track("atelier_direction", { direction: storeConcepts[index].id });
  }
  return (
    <section
      className="atelier-section"
      id="atelier"
      aria-labelledby="atelier-title"
    >
      <div className="container">
        <div className="atelier-heading">
          <div>
            <SectionLabel>
              THE COMMERCE ATELIER / A LIVE EXPLORATION
            </SectionLabel>
            <h2 id="atelier-title">
              One foundation.
              <br />
              <span>A world of possibilities.</span>
            </h2>
          </div>
          <div className="atelier-invitation">
            <SlidersHorizontal size={21} strokeWidth={1.2} />
            <p>
              Don’t just picture the possibilities.
              <br />
              <strong>Try a different point of view.</strong>
            </p>
            <ArrowDown size={18} />
          </div>
        </div>
        <div className="atelier-workspace">
          <div className="atelier-controls">
            <div className="atelier-control-label">
              <span>01 / CHOOSE A WORLD</span>
              <span>LIVE DEMO</span>
            </div>
            <div
              className="direction-options"
              aria-label="Storefront art direction"
            >
              {storeConcepts.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => choose(index)}
                  aria-pressed={direction === index}
                  className={direction === index ? "selected" : ""}
                >
                  <img
                    src={item.smallImage}
                    alt=""
                    width="70"
                    height="80"
                    loading="lazy"
                  />
                  <span>
                    <small>{item.industry}</small>
                    <strong>{item.name}</strong>
                    <span className="direction-palette" aria-hidden="true">
                      {item.palette.map((color) => (
                        <i key={color} style={{ background: color }} />
                      ))}
                    </span>
                  </span>
                  <span className="direction-indicator">
                    {direction === index ? (
                      <Check size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="atelier-layout-control">
              <span className="atelier-control-label">
                02 / SET THE COMPOSITION
              </span>
              <div aria-label="Storefront composition">
                {["Editorial", "Product first"].map((item) => (
                  <button
                    key={item}
                    aria-pressed={layout === item}
                    onClick={() => setLayout(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="atelier-concept-note" key={concept.id}>
              <span>{concept.mood}</span>
              <p>{concept.description}</p>
            </div>
            <div className="atelier-reset">
              <button
                onClick={() => {
                  setDirection(0);
                  setDevice("Desktop");
                  setLayout("Editorial");
                }}
              >
                <RotateCcw size={13} /> Reset the canvas
              </button>
              <span>NO TEMPLATES. JUST POSSIBILITIES.</span>
            </div>
          </div>
          <div
            className={`atelier-preview atelier-${concept.id} composition-${layout === "Editorial" ? "editorial" : "product"} ${device === "Mobile" ? "atelier-mobile" : ""}`}
          >
            <div className="atelier-preview-toolbar">
              <span>
                <i /> LIVE PREVIEW / {String(direction + 1).padStart(2, "0")}
              </span>
              <div aria-label="Atelier preview device">
                <button
                  aria-label="Preview desktop storefront"
                  aria-pressed={device === "Desktop"}
                  onClick={() => setDevice("Desktop")}
                >
                  <Monitor size={16} />
                </button>
                <button
                  aria-label="Preview mobile storefront"
                  aria-pressed={device === "Mobile"}
                  onClick={() => setDevice("Mobile")}
                >
                  <Smartphone size={16} />
                </button>
              </div>
            </div>
            <div className="atelier-preview-stage">
              <div className="atelier-store-shell">
                <Storefront
                  key={concept.id}
                  compact
                  concept={concept}
                  device={device}
                />
              </div>
              <span className="atelier-corner corner-top" aria-hidden="true" />
              <span
                className="atelier-corner corner-bottom"
                aria-hidden="true"
              />
            </div>
            <div className="atelier-preview-caption">
              <span>CHANGE THE DIRECTION. FEEL THE DIFFERENCE.</span>
              <span>DESIGN + DEVELOPMENT</span>
            </div>
          </div>
        </div>
        <div className="atelier-bottom">
          <p>
            Three illustrative brands. One idea: your store should feel
            unmistakably yours.
          </p>
          <a href="#contact" className="text-link">
            Now, imagine your brand here <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
