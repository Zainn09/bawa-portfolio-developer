import { ArrowUpRight, Asterisk, Plus } from "lucide-react";
import {
  profile,
  testimonials,
  clientLogos,
  statistics,
} from "@/data/portfolio";
import { SectionLabel } from "./shared";
const details = [
  "Consistent spacing",
  "Fast interactions",
  "Clear navigation",
  "Useful filters",
  "Clean product pages",
  "Search visibility",
  "A smooth cart",
  "Maintainable code",
];
export default function About() {
  return (
    <>
      <section className="about-section section-pad container" id="about">
        <figure className="about-figure">
          <div className="about-portrait">
            <img
              src={profile.image}
              alt="Abstract personal profile placeholder, ready for your portrait"
              width="700"
              height="800"
              loading="lazy"
            />
            <div className="portrait-label">
              <span>THE PERSON BEHIND THE PIXELS</span>
              <Asterisk size={22} />
            </div>
            <span className="portrait-placeholder">
              YOUR PORTRAIT GOES HERE
            </span>
          </div>
          <figcaption className="about-signature">
            <img
              src="/images/brand/ahmad-abdullah-signature.svg"
              width="400"
              height="112"
              alt="Ahmad Abdullah — personal signature"
              loading="lazy"
            />
            <span>PERSONALLY INVESTED. FROM FIRST IDEA TO WHAT’S NEXT.</span>
          </figcaption>
        </figure>
        <div className="about-copy">
          <SectionLabel>PERSONAL, BY DESIGN / 10</SectionLabel>
          <h2>
            A developer.
            <br />A detail person.
            <br />
            <span className="muted">Your commerce partner.</span>
          </h2>
          <div className="about-name">
            <h3>{profile.name}</h3>
            <span>SHOPIFY DEVELOPER / E-COMMERCE</span>
          </div>
          <p>{profile.introduction}</p>
          <p>
            I care about the details customers notice without knowing why. The
            spacing. The speed. The way a product page answers the right
            question at the right moment.
          </p>
          <div className="care-tags">
            {details.map((d) => (
              <span key={d}>
                <Plus size={11} />
                {d}
              </span>
            ))}
          </div>
          <a className="text-link" href="#contact">
            Let’s make something considered <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
      {statistics.length > 0 && (
        <section className="container statistics" aria-label="Experience">
          {statistics.map((s) => (
            <div key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </section>
      )}
      {testimonials.length > 0 && (
        <section className="container testimonials">
          <SectionLabel>IN THEIR WORDS</SectionLabel>
          {testimonials.map((t) => (
            <figure key={`${t.name}-${t.date}`}>
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                {t.name} · {t.role}, {t.company}
                <time dateTime={t.date}>{t.date}</time>
              </figcaption>
              {t.image && (
                <img
                  src={t.image}
                  alt={t.name}
                  width="64"
                  height="64"
                  loading="lazy"
                />
              )}
              {t.projectReference && (
                <a href={t.projectReference}>Related project ↗</a>
              )}
            </figure>
          ))}
        </section>
      )}
      {clientLogos.length > 0 && (
        <section className="container client-logos" aria-label="Clients">
          {clientLogos.map((c) => (
            <img
              key={c.name}
              src={c.image}
              alt={c.name}
              width="140"
              height="70"
              loading="lazy"
            />
          ))}
        </section>
      )}
    </>
  );
}
