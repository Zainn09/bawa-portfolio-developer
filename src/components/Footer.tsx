import { ArrowUpRight, ArrowUp } from "lucide-react";
import { profile } from "@/data/portfolio";
import BrandMark from "./BrandMark";
export default function Footer() {
  return (
    <footer className="signature-footer">
      <div className="container">
        <div className="signature-footer-top">
          <a className="brand footer-brand" href="#home">
            <BrandMark size={44} />
            <span>
              {profile.name}
              <small>INDEPENDENT SHOPIFY DEVELOPER</small>
            </span>
          </a>
          <span className="footer-edition">
            PERSONAL BY DESIGN.
            <br />
            COMMERCE BY CRAFT.
          </span>
        </div>
        <div className="footer-invitation">
          <div>
            <span className="section-label">
              GOOD THINGS START WITH A CONVERSATION
            </span>
            <h2>
              Your next chapter.
              <br />
              <span>Let’s build it properly.</span>
            </h2>
          </div>
          <a
            className="footer-project-link"
            href="#contact"
            aria-label="Start a project with Ahmad Abdullah"
          >
            <span className="footer-project-copy">
              <strong>Start a project</strong>
              <span>Tell me what you’re thinking.</span>
            </span>
            <span className="footer-project-arrow" aria-hidden="true">
              <ArrowUpRight size={24} strokeWidth={1.5} />
            </span>
          </a>
        </div>
        <div className="footer-directory">
          <p>
            I don’t just build Shopify stores.
            <br />I build the experience around them.
            <span>
              Thoughtful design. Dependable development.
              <br />A partner for what comes next.
            </span>
          </p>
          <nav aria-label="Footer navigation">
            <span className="footer-column-label">EXPLORE</span>
            {["Work", "Expertise", "Shopify", "Process", "Blogs"].map(
              (link) => (
                <a key={link} href={`#${link.toLowerCase()}`}>
                  {link}
                  <ArrowUpRight size={12} />
                </a>
              ),
            )}
          </nav>
          <nav aria-label="Personal navigation">
            <span className="footer-column-label">THE HUMAN SIDE</span>
            <a href="#about">
              About Ahmad
              <ArrowUpRight size={12} />
            </a>
            <a href="#contact">
              Let’s talk
              <ArrowUpRight size={12} />
            </a>
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
            {profile.email && (
              <a href={`mailto:${profile.email}`}>
                Email me
                <ArrowUpRight size={12} />
              </a>
            )}
          </nav>
          <a className="footer-back" href="#home">
            <span>
              BACK TO
              <br />
              THE TOP
            </span>
            <ArrowUp size={23} strokeWidth={1.3} />
          </a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          {profile.name.toLowerCase()}
          <span>✳</span>
        </div>
        <div className="signature-footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>BUILT FOR COMMERCE. CRAFTED FOR PEOPLE.</span>
          <span>SHOPIFY / SHOPIFY PLUS / E-COMMERCE</span>
        </div>
      </div>
    </footer>
  );
}
