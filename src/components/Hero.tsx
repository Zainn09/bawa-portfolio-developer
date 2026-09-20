"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Code2,
  Check,
  Asterisk,
  MousePointer2,
  ShoppingBag,
} from "lucide-react";
import Storefront from "./Storefront";
import BrandMark from "./BrandMark";
import { images, profile } from "@/data/portfolio";
import { track } from "@/lib/analytics";
const phases = ["Design", "Develop", "Optimize", "Launch"];
export default function Hero() {
  const [phase, setPhase] = useState(0);
  return (
    <>
      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> INDEPENDENT THINKING. COMPLETE
            COMMERCE.
          </div>
          <h1>
            Not just stores.
            <br />
            Commerce
            <br />
            <span>experiences.</span>
            <span className="heading-star">✳</span>
          </h1>
          <p className="hero-description">
            I build Shopify stores that look great,
            <br className="desktop-br" /> work beautifully, and mean business.
          </p>
          <p className="hero-support">
            From the first idea to the everyday details.
            <br />
            Design, development, SEO, CRO, and everything in between.
          </p>
          <div className="hero-actions">
            <a
              className="button button-accent"
              href="#work"
              onClick={() => track("hero_cta", { target: "work" })}
            >
              Explore my work <ArrowUpRight size={18} />
            </a>
            <a
              className="text-link button-outline"
              href="#contact"
              onClick={() => track("hero_cta", { target: "contact" })}
            >
              Let’s build your store <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-specialties">
            <ShoppingBag size={17} strokeWidth={1.4} />
            <span>SHOPIFY</span>
            <i />
            <span>SHOPIFY PLUS</span>
            <i />
            <span>CUSTOM THEMES</span>
          </div>
          <div className="hero-authorship">
            <BrandMark size={30} />
            <span>
              <strong>{profile.name}</strong>
              <span>Design-minded developer. Commerce-minded partner.</span>
            </span>
            <a href="#atelier" aria-label="Try the Commerce Atelier">
              <span>EXPLORE THE ATELIER</span>
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-coordinate">FIG. 01 — COMMERCE, CRAFTED.</div>
          <div className="hero-store-wrap">
            <Storefront
              highlight={
                [
                  "",
                  "Custom sections. Your rules.",
                  "Discoverable. Fast. Frictionless.",
                  "Your next chapter, ready.",
                ][phase]
              }
            />
          </div>
          <div className="floating-theme">
            <span>
              <Code2 size={15} />
            </span>
            <div>
              Built around the brand
              <small>
                {
                  [
                    "CUSTOM SHOPIFY THEME",
                    "CLEAN, MAINTAINABLE CODE",
                    "SEO + CRO + PERFORMANCE",
                    "FROM CONCEPT TO COMMERCE",
                  ][phase]
                }
              </small>
            </div>
            <Check size={14} />
          </div>
          <div className="phone-preview">
            <div className="phone-notch" />
            <div className="phone-nav">
              form&field. <ShoppingBag size={9} />
            </div>
            <img
              src={images.heroSmall}
              alt="Mobile layout of the concept furniture storefront"
              width="720"
              height="480"
            />
            <div className="phone-copy">
              <span>LESS, BUT BETTER.</span>
              <strong>
                Make room
                <br />
                for the everyday.
              </strong>
              <span className="phone-shop">Find your everyday ↗</span>
            </div>
            <div className="phone-bottom">
              <span>Considered living.</span>
              <div>
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="responsive-note">
            <span className="hand-arrow">↙</span> Every screen.
            <br />
            Every little detail.
          </div>
          <div className="commerce-seal" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs>
                <path
                  id="commerce-seal-path"
                  d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0"
                />
              </defs>
              <circle cx="60" cy="60" r="57" />
              <text>
                <textPath href="#commerce-seal-path" textLength="268">
                  DESIGN WITH INTENT · BUILD WITH CARE ·{" "}
                </textPath>
              </text>
            </svg>
            <BrandMark size={35} />
          </div>
          <div className="hero-art-footer">
            <div className="phase-tabs" aria-label="Commerce stages">
              {phases.map((name, i) => (
                <button
                  key={name}
                  onClick={() => setPhase(i)}
                  aria-pressed={phase === i}
                  className={phase === i ? "active" : ""}
                >
                  <span>0{i + 1}</span>
                  {name}
                  {i < 3 && <span className="phase-arrow">→</span>}
                </button>
              ))}
            </div>
            <span className="concept-note">INTERACTIVE CONCEPT STORE</span>
          </div>
        </div>
      </section>
      <div className="craft-strip">
        <div className="container">
          <span>
            GOOD COMMERCE IS
            <br />
            <strong>MORE THAN GOOD CODE.</strong>
          </span>
          <div>
            Design <Asterisk /> Development <Asterisk /> Discovery <Asterisk />{" "}
            Conversion <Asterisk /> Growth
          </div>
          <a href="#intro" aria-label="Scroll to introduction">
            <ArrowDown size={20} />
          </a>
        </div>
      </div>
    </>
  );
}
