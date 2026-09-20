"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, Sun, Moon, Menu, X, Asterisk } from "lucide-react";
import BrandMark from "./BrandMark";
import { profile } from "@/data/portfolio";
import { track } from "@/lib/analytics";
const links = ["Work", "Expertise", "Shopify", "Process", "About"];
export default function Navigation() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
    track("theme_toggle", { theme: next ? "dark" : "light" });
  }
  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-container">
        <a className="brand" href="#home" aria-label={`${profile.name} — home`}>
          <BrandMark className="brand-mark" />
          <span>
            {profile.name}
            <small>SHOPIFY DEVELOPER</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => track("navigation", { section: link })}
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-cta" href="#contact">
            Let’s build <ArrowUpRight size={16} />
          </a>
          <button
            className="theme-toggle icon-button"
            onClick={toggle}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="mobile-toggle icon-button"
            onClick={() => setMenu(!menu)}
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {menu && (
        <nav
          className="mobile-nav"
          id="mobile-nav"
          aria-label="Mobile navigation"
        >
          {[...links, "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenu(false)}
            >
              {link}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
