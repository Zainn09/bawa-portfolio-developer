"use client";
import { Fragment, useState } from "react";
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
import type { StoreConcept } from "@/data/atelier";
import { images } from "@/data/portfolio";
import { Modal } from "./shared";
export default function Storefront({
  compact = false,
  stage = 3,
  highlight = "",
  device = "Desktop",
  concept,
}: {
  compact?: boolean;
  stage?: number;
  highlight?: string;
  device?: string;
  concept?: StoreConcept;
}) {
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState(false);
  const [page, setPage] = useState(concept ? "Collection" : "Living");
  const [mobileNav, setMobileNav] = useState(false);
  const categories = concept
    ? ["Collection", "Details", "Our story"]
    : ["Living", "Objects", "Our story"];
  const visual = concept?.image || images.hero;
  const thumbnail = concept?.smallImage || images.heroSmall;
  const productName = concept?.product || "The Sunday lounge chair";
  const material = concept?.material || "Natural oak / Ivory bouclé";
  const price = concept?.price ?? 420;
  const money = (amount: number) => `£${amount.toFixed(2)}`;
  const headline =
    concept &&
    (page === "Details"
      ? concept.detailHeadline
      : page === "Our story"
        ? concept.storyHeadline
        : concept.headline);
  return (
    <div
      className={`store-browser ${compact ? "compact" : ""} ${device === "Mobile" ? "mobile-store" : ""} stage-${stage} ${concept ? `concept-${concept.id}` : ""}`}
    >
      <div className="browser-chrome">
        <div className="browser-dots">
          <i />
          <i />
          <i />
        </div>
        <span>
          <LockKeyhole size={8} /> {concept?.domain || "formandfield.demo"}
        </span>
        <ArrowUpRight size={10} />
      </div>
      <div className="store-screen">
        <div className="store-announcement">
          {concept?.announcement || "Considered objects. Everyday living."}
        </div>
        <div className="store-nav" inert={stage < 2}>
          <span className="store-logo">
            {concept ? (
              concept.name
            ) : (
              <>
                form<span>&</span>field<span className="logo-period">.</span>
              </>
            )}
          </span>
          <nav aria-label="Demo storefront collections">
            {categories.map((p) => (
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
            {categories.map((p) => (
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
            src={visual}
            srcSet={`${thumbnail} 720w, ${visual} 1400w`}
            sizes="(max-width: 600px) 90vw, 650px"
            alt={
              concept?.imageAlt ||
              "Oak and ivory lounge chair in a sunlit, warm plaster interior"
            }
            width="1400"
            height="933"
            fetchPriority={compact ? "auto" : "high"}
            loading={compact ? "lazy" : "eager"}
          />
          <div className="store-campaign-copy">
            <span className="store-eyebrow">
              {concept
                ? concept.eyebrow
                : page === "Objects"
                  ? "THOUGHTFULLY MADE"
                  : page === "Our story"
                    ? "LESS, BUT BETTER"
                    : "THE ART OF SLOW LIVING"}
            </span>
            <h3>
              {headline ? (
                headline.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))
              ) : page === "Objects" ? (
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
              {concept
                ? page === "Our story"
                  ? concept.story
                  : concept.supporting
                : page === "Our story"
                  ? "Natural materials. An intentional approach."
                  : "Thoughtful pieces for the spaces we call home."}
            </p>
            <button
              onClick={() =>
                setPage(page === categories[0] ? categories[1] : categories[0])
              }
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
            <h4>{productName}</h4>
            <span className="store-material">{material}</span>
          </div>
          <div className="store-product-buy">
            <span>
              {money(price)} <small>Demo product</small>
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
                    src={thumbnail}
                    width="160"
                    height="160"
                    alt={productName}
                  />
                  <div>
                    <h3>{productName}</h3>
                    <p>{material}</p>
                    <strong>{money(price)}</strong>
                    <div className="quantity">
                      <button
                        onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                        aria-label={
                          concept
                            ? "Remove one demo product"
                            : "Remove one chair"
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label={
                          concept ? "Add one demo product" : "Add one chair"
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="cart-total">
                  <span>Subtotal</span>
                  <strong>{money(quantity * price)}</strong>
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
