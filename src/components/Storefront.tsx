"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Check,
  LockKeyhole,
  Menu,
} from "lucide-react";
import { images } from "@/data/portfolio";
import { Modal } from "./shared";
export default function Storefront({
  compact = false,
  stage = 3,
  highlight = "",
  device = "Desktop",
}: {
  compact?: boolean;
  stage?: number;
  highlight?: string;
  device?: string;
}) {
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState(false);
  const [page, setPage] = useState("Living");
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div
      className={`store-browser ${compact ? "compact" : ""} ${device === "Mobile" ? "mobile-store" : ""} stage-${stage}`}
    >
      <div className="browser-chrome">
        <div className="browser-dots">
          <i />
          <i />
          <i />
        </div>
        <span>
          <LockKeyhole size={8} /> formandfield.demo
        </span>
        <ArrowUpRight size={10} />
      </div>
      <div className="store-screen">
        <div className="store-announcement">
          Considered objects. Everyday living.
        </div>
        <div className="store-nav" inert={stage < 2}>
          <span className="store-logo">
            form<span>&</span>field<span className="logo-period">.</span>
          </span>
          <nav aria-label="Demo storefront collections">
            {["Living", "Objects", "Our story"].map((p) => (
              <button
                key={p}
                className={page === p ? "active" : ""}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </nav>
          <div className="store-nav-right">
            <button
              className="store-mobile-menu"
              aria-label="Demo store navigation"
              aria-expanded={mobileNav}
              onClick={() => setMobileNav(!mobileNav)}
            >
              <Menu size={13} />
            </button>
            <button
              className="store-bag"
              onClick={() => setCart(true)}
              aria-label={`Open demo cart, ${quantity} items`}
            >
              <ShoppingBag size={14} />
              <span>{quantity}</span>
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="demo-mobile-nav">
            {["Living", "Objects", "Our story"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPage(p);
                  setMobileNav(false);
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <div
          className={`store-campaign ${highlight ? "is-highlighted" : ""}`}
          inert={stage < 2}
        >
          <img
            src={images.hero}
            srcSet={`${images.heroSmall} 720w, ${images.hero} 1400w`}
            sizes="(max-width: 600px) 90vw, 650px"
            alt="Oak and ivory lounge chair in a sunlit, warm plaster interior"
            width="1400"
            height="933"
            fetchPriority={compact ? "auto" : "high"}
            loading={compact ? "lazy" : "eager"}
          />
          <div className="store-campaign-copy">
            <span className="store-eyebrow">
              {page === "Objects"
                ? "THOUGHTFULLY MADE"
                : page === "Our story"
                  ? "LESS, BUT BETTER"
                  : "THE ART OF SLOW LIVING"}
            </span>
            <h3>
              {page === "Objects" ? (
                <>
                  Objects with
                  <br />a little soul.
                </>
              ) : page === "Our story" ? (
                <>
                  Made for life.
                  <br />
                  Made to last.
                </>
              ) : (
                <>
                  A little less.
                  <br />A little better.
                </>
              )}
            </h3>
            <p>
              {page === "Our story"
                ? "Natural materials. An intentional approach."
                : "Thoughtful pieces for the spaces we call home."}
            </p>
            <button
              onClick={() => setPage(page === "Living" ? "Objects" : "Living")}
            >
              Explore the collection <ArrowRight size={12} />
            </button>
          </div>
          {highlight && (
            <div className="store-highlight">
              <Check size={12} />
              {highlight}
            </div>
          )}
        </div>
        <div className="store-product" inert={stage < 2}>
          <div>
            <span className="store-product-category">
              {page === "Objects"
                ? "EVERYDAY OBJECTS"
                : "THE EVERYDAY COLLECTION"}
            </span>
            <h4>The Sunday lounge chair</h4>
            <span className="store-material">Natural oak / Ivory bouclé</span>
          </div>
          <div className="store-product-buy">
            <span>
              £420.00 <small>Demo product</small>
            </span>
            <button
              onClick={() => {
                setQuantity((q) => q + 1);
                setCart(true);
              }}
            >
              Add to bag <Plus size={12} />
            </button>
          </div>
        </div>
        <div className="store-benefits">
          <span>Considered design</span>
          <span>Natural materials</span>
          <span>Made for everyday</span>
        </div>
        {stage < 2 && (
          <div className="build-overlay">
            <span className="mono">
              {stage === 0 ? "01 / THE STARTING POINT" : "02 / THE BLUEPRINT"}
            </span>
            <div className="wireframe">
              <i />
              <i />
              <i />
              <i />
            </div>
            <strong>
              {stage === 0
                ? "Every great store starts with an idea."
                : "A place for everything."}
            </strong>
            <p>
              {stage === 0
                ? "Brand. Customer. Purpose."
                : "Navigation → Collections → Products"}
            </p>
          </div>
        )}
      </div>
      {cart && (
        <Modal title="Demo shopping bag" onClose={() => setCart(false)}>
          <div className="cart-content">
            <span className="section-label">INTERACTIVE STOREFRONT DEMO</span>
            <h2>
              Your bag<span> ({quantity})</span>
            </h2>
            {quantity ? (
              <>
                <div className="cart-item">
                  <img
                    src={images.heroSmall}
                    width="160"
                    height="160"
                    alt="Sunday lounge chair"
                  />
                  <div>
                    <h3>The Sunday lounge chair</h3>
                    <p>Natural oak / Ivory bouclé</p>
                    <strong>£420.00</strong>
                    <div className="quantity">
                      <button
                        onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                        aria-label="Remove one chair"
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Add one chair"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="cart-total">
                  <span>Subtotal</span>
                  <strong>£{(quantity * 420).toFixed(2)}</strong>
                </div>
                <div className="demo-notice">
                  <LockKeyhole size={16} />
                  <p>
                    This is a concept storefront. No payment is collected and no
                    order will be placed.
                  </p>
                </div>
                <button
                  className="button button-dark"
                  onClick={() => setCart(false)}
                >
                  Continue exploring <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                <p className="empty-cart">
                  A little room for something considered.
                  <br />
                  Your demo bag is currently empty.
                </p>
                <button
                  className="button button-dark"
                  onClick={() => setCart(false)}
                >
                  Explore the store <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
