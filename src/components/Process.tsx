"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Check,
  Database,
  ArrowDown,
} from "lucide-react";
import { process, conceptProjects, images } from "@/data/portfolio";
import { SectionLabel } from "./shared";
import Storefront from "./Storefront";
export function Process() {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [pin, setPin] = useState({
    enabled: false,
    top: 88,
    stride: 320,
    height: 0,
  });
  const [reducedMotion, setReducedMotion] = useState(false);
  const geometryRef = useRef(pin);
  const pendingProgress = useRef<number | null>(null);

  useLayoutEffect(() => {
    geometryRef.current = pin;
    // Keep the same place in the chapter when fonts or viewport dimensions change.
    if (pendingProgress.current !== null && pin.enabled && ref.current) {
      const start = ref.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: start - pin.top + pendingProgress.current * pin.stride,
        behavior: "instant",
      });
    }
    pendingProgress.current = null;
  }, [pin]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const panel = pinRef.current;
        const section = ref.current;
        if (!panel || !section) return;
        const clearance = window.innerWidth < 768 ? 80 : 88;
        const stride = Math.max(210, Math.min(420, window.innerHeight * 0.38));
        const panelHeight = Math.ceil(panel.getBoundingClientRect().height);
        // Tall panels scroll into view naturally, then stick at their bottom edge.
        // Never disable the chapter just because a label wraps or a toolbar resizes.
        const next = {
          enabled: !media.matches,
          top: Math.min(clearance, window.innerHeight - panelHeight - 12),
          stride,
          height: panelHeight + stride * process.length,
        };
        setReducedMotion(media.matches);
        const previous = geometryRef.current;
        if (
          next.enabled === previous.enabled &&
          next.top === previous.top &&
          next.stride === previous.stride &&
          next.height === previous.height
        )
          return;
        const progress =
          (previous.top - section.getBoundingClientRect().top) /
          previous.stride;
        if (
          previous.enabled &&
          next.enabled &&
          progress >= 0 &&
          progress < process.length
        ) {
          pendingProgress.current = progress;
        }
        setPin(next);
      });
    };
    const observer = new ResizeObserver(measure);
    if (pinRef.current) observer.observe(pinRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("pageshow", measure);
    media.addEventListener("change", measure);
    document.fonts.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      media.removeEventListener("change", measure);
    };
  }, []);
  useEffect(() => {
    if (!pin.enabled) return;
    let frame = 0;
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current) return;
        // Discover holds until the entire panel reaches its sticky top position.
        const traveled = Math.max(
          0,
          pin.top - ref.current.getBoundingClientRect().top,
        );
        setStep(
          Math.min(process.length - 1, Math.floor(traveled / pin.stride)),
        );
      });
    };
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [pin.enabled, pin.top, pin.stride]);
  useEffect(() => {
    const active = pinRef.current?.querySelector<HTMLButtonElement>(
      ".process-timeline button.active",
    );
    const timeline = active?.parentElement;
    if (active && timeline && timeline.scrollWidth > timeline.clientWidth) {
      timeline.scrollTo({
        left:
          active.offsetLeft - timeline.clientWidth / 2 + active.offsetWidth / 2,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [step, reducedMotion]);
  function selectStep(index: number) {
    setStep(index);
    if (pin.enabled && ref.current) {
      const start =
        ref.current.getBoundingClientRect().top + window.scrollY - pin.top;
      window.scrollTo({
        top: start + (index + 0.12) * pin.stride,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }
  return (
    <section
      className={`process-section section-pad ${pin.enabled ? "is-pinned" : "manual-process"}`}
      id="process"
      ref={ref}
      data-step={step}
      style={
        {
          "--process-pin-top": `${pin.top}px`,
          "--process-track-height": `${pin.height}px`,
        } as CSSProperties
      }
    >
      <div className="container process-pin" ref={pinRef}>
        <div className="section-heading">
          <div>
            <SectionLabel>FROM IDEA TO EVERYDAY / 06</SectionLabel>
            <h2>
              Empty canvas.
              <br />
              <span className="muted">Endless possibility.</span>
            </h2>
          </div>
          <p className="heading-aside">
            From an empty Shopify store to
            <br />a complete commerce experience.
            <br />
            <span className="small-note">
              {pin.enabled
                ? "SCROLL TO BUILD. STAY FOR THE WHOLE JOURNEY."
                : "CHOOSE A STAGE. BUILD AT YOUR OWN PACE."}
            </span>
          </p>
        </div>
        <div className="process-timeline">
          {process.map((s, i) => (
            <button
              className={step === i ? "active" : step > i ? "complete" : ""}
              aria-pressed={step === i}
              key={s.name}
              onClick={() => {
                selectStep(i);
              }}
            >
              <span>{step > i ? <Check size={14} /> : `0${i + 1}`}</span>
              {s.name}
            </button>
          ))}
        </div>
        <div className="process-scroll-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / process.length) * 100}%` }} />
        </div>
        <div className="process-stage">
          <div className="process-stage-copy" aria-live="polite">
            <span className="process-big-number" aria-hidden="true">
              0{step + 1}
            </span>
            <div className="process-copy-stack">
              {process.map((stage, index) => (
                <div
                  key={stage.name}
                  className="process-copy-panel"
                  data-active={step === index}
                  aria-hidden={step !== index}
                  inert={step !== index}
                >
                  <span className="mono accent">
                    {stage.name.toUpperCase()}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.text}</p>
                  {index < process.length - 1 ? (
                    <button
                      className="text-link button-outline"
                      onClick={() => selectStep(index + 1)}
                    >
                      Next: {process[index + 1].name}
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <a className="text-link button-outline" href="#contact">
                      Ready to build yours? <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="process-store">
            <Storefront
              compact
              stage={step}
              highlight={
                step >= 4
                  ? [
                      "Products, variants & collections",
                      "SEO + CRO + performance",
                      "Real devices. Real interactions.",
                      "Ready for a considered launch.",
                      "Made to evolve with the business.",
                    ][step - 4]
                  : ""
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export function Transformation() {
  const [position, setPosition] = useState(48);
  const project = conceptProjects[0];
  if (!project?.beforeImage || !project.afterImage) return null;
  return (
    <section className="transformation-section section-pad container">
      <div className="section-heading">
        <div>
          <SectionLabel>A DIFFERENT KIND OF AFTER / 07</SectionLabel>
          <h2>
            From a storefront.
            <br />
            <span className="muted">To a brand experience.</span>
          </h2>
        </div>
        <p className="heading-aside">
          Same product. A different perspective.
          <br />
          <span className="small-note">
            ILLUSTRATIVE BEFORE / AFTER CONCEPT
          </span>
        </p>
      </div>
      <div className="comparison">
        <img
          className="comparison-image"
          src={project.afterImage}
          alt="After: warm branded furniture storefront with considered editorial hierarchy"
          width="1400"
          height="780"
          loading="lazy"
        />
        <div
          className="comparison-before"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            className="comparison-image"
            src={project.beforeImage}
            alt="Before: simple, unstyled furniture storefront concept"
            width="1400"
            height="780"
            loading="lazy"
          />
        </div>
        <span className="compare-label before-label">BEFORE / BASIC</span>
        <span className="compare-label after-label">AFTER / CONSIDERED</span>
        <div className="comparison-line" style={{ left: `${position}%` }}>
          <span>↔</span>
        </div>
        <input
          type="range"
          min="2"
          max="98"
          value={position}
          aria-label="Compare before and after storefront designs"
          onChange={(e) => setPosition(Number(e.target.value))}
        />
      </div>
      <div className="comparison-caption">
        <span>STRUCTURE → DESIGN → DEVELOPMENT → SEO → CRO</span>
        <span>DRAG TO EXPLORE</span>
      </div>
    </section>
  );
}
export function Management() {
  const [structured, setStructured] = useState(true);
  return (
    <section className="management-section section-pad">
      <div className="container management-layout">
        <div>
          <SectionLabel>AFTER THE LAUNCH / 08</SectionLabel>
          <h2>
            Build it. Manage it.
            <br />
            <span className="muted">Keep it growing.</span>
          </h2>
          <p>
            The details behind the store deserve as much care as the storefront
            itself. Clean data, current content, and reliable day-to-day
            support.
          </p>
          <div className="management-tags">
            {[
              "Product & content updates",
              "Collection management",
              "Theme maintenance",
              "Bug fixes & new features",
              "SEO & performance upkeep",
              "App & analytics integrations",
            ].map((t) => (
              <span key={t}>
                <Check size={14} />
                {t}
              </span>
            ))}
          </div>
          <a href="#contact" className="text-link">
            A partner beyond launch <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="data-card">
          <div className="data-card-header">
            <Database size={17} />
            <span>THE DETAILS BEHIND THE STORE</span>
            <span className="demo-badge">DEMO DATA</span>
          </div>
          <div className="data-tabs">
            <button
              aria-pressed={!structured}
              className={!structured ? "active" : ""}
              onClick={() => setStructured(false)}
            >
              01 / Raw product data
            </button>
            <ArrowRight size={14} />
            <button
              aria-pressed={structured}
              className={structured ? "active" : ""}
              onClick={() => setStructured(true)}
            >
              02 / Store-ready
            </button>
          </div>
          {structured ? (
            <div className="structured-data">
              <div className="data-product">
                <img
                  src={images.heroSmall}
                  alt="Sample Sunday lounge chair product"
                  width="100"
                  height="100"
                  loading="lazy"
                />
                <div>
                  <span className="small-note">
                    FORM & FIELD / SAMPLE PRODUCT
                  </span>
                  <h3>The Sunday lounge chair</h3>
                  <span className="data-ready">
                    <Check size={11} /> Structured & organized
                  </span>
                </div>
              </div>
              <dl>
                {[
                  ["SKU", "FF-CHAIR-OAK-01"],
                  ["Price", "GBP 420.00"],
                  ["Variants", "Oak / Ivory bouclé"],
                  ["Collection", "Living / Seating"],
                  ["Tags", "Lounge chair, natural oak"],
                  ["Metafields", "Material: oak · Care: dry cloth"],
                  ["SEO title", "Sunday Lounge Chair | Form & Field"],
                ].map(([key, val]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="raw-data">
              <span className="mono">PRODUCT-IMPORT.CSV — SAMPLE INPUT</span>
              <pre>
                {
                  "name,sku,price,color,material\nchair sunday,ff-chair-oak-01,420,ivory,oak\n\nDescription: [to be organized]\nImages: chair-front.webp;chair-side.webp\nCollection: [to be mapped]\nTags: [to be standardized]\nSEO title: [to be written]"
                }
              </pre>
              <p>
                The raw details are here. The next step is making them
                consistent, useful, and ready for the store.
              </p>
            </div>
          )}
          <div className="data-flow">
            CLEAN DATA <ArrowRight size={10} /> PRODUCTS{" "}
            <ArrowRight size={10} /> COLLECTIONS <ArrowRight size={10} />{" "}
            PUBLISHED STORE
          </div>
        </div>
      </div>
    </section>
  );
}
export function ResponsiveShowcase() {
  const [device, setDevice] = useState("Desktop");
  const devices = [
    { name: "Desktop", icon: Monitor },
    { name: "Laptop", icon: Laptop },
    { name: "Tablet", icon: Tablet },
    { name: "Mobile", icon: Smartphone },
  ];
  return (
    <section className="responsive-section section-pad container">
      <div className="responsive-heading">
        <SectionLabel>NOT AN AFTERTHOUGHT / 09</SectionLabel>
        <h2>
          One store. <span className="muted">Every screen.</span>
        </h2>
        <p>Not just scaled down. Thoughtfully reimagined.</p>
      </div>
      <div className="device-select">
        {devices.map((d) => (
          <button
            key={d.name}
            className={device === d.name ? "active" : ""}
            aria-pressed={device === d.name}
            onClick={() => setDevice(d.name)}
          >
            <d.icon size={18} />
            {d.name}
          </button>
        ))}
      </div>
      <div className="device-stage">
        <div className={`device-frame device-${device.toLowerCase()}`}>
          <Storefront compact device={device} />
        </div>
      </div>
      <div className="responsive-bottom">
        <span>READABLE CONTENT</span>
        <span>TOUCH-FRIENDLY INTERACTIONS</span>
        <span>A CONSISTENT BRAND EXPERIENCE</span>
      </div>
    </section>
  );
}
