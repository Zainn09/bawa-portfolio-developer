"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Asterisk,
  Check,
  LoaderCircle,
} from "lucide-react";
import { profile, projectTypes } from "@/data/portfolio";
import { validateContact } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { SectionLabel } from "./shared";
export default function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");
  const started = useRef(0);
  useEffect(() => {
    started.current = Date.now();
  }, []);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const raw = {
      ...Object.fromEntries(new FormData(form)),
      startedAt: started.current,
    };
    const validation = validateContact(raw);
    setErrors(validation.errors);
    if (!validation.data) {
      setStatus("error");
      setFeedback("A few details need another look.");
      const field = Object.keys(validation.errors)[0];
      (form.elements.namedItem(field) as HTMLElement)?.focus();
      return;
    }
    setStatus("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = await response.json();
      if (!response.ok) {
        if (result.errors) setErrors(result.errors);
        throw new Error(
          result.error || "Something went wrong. Please try again.",
        );
      }
      setStatus("success");
      setFeedback(result.message);
      track("contact_submission", { result: "success" });
      form.reset();
      started.current = Date.now();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "Connection interrupted. Your draft is still here. Please try again.",
      );
    }
  }
  const fieldProps = (name: string) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const error = (name: string) =>
    errors[name] && (
      <span className="field-error" id={`${name}-error`}>
        {errors[name]}
      </span>
    );
  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-callout">
          <SectionLabel>YOUR NEXT CHAPTER</SectionLabel>
          <h2>
            Have a store in mind?
            <br />
            Let’s make it <span>matter.</span>
            <Asterisk aria-hidden="true" />
          </h2>
          <div>
            <p>
              Starting fresh, rethinking what’s there, or making the everyday
              better.
              <br />
              Let’s build a commerce experience that feels like you.
            </p>
            <a href="#project-form" className="button button-dark">
              Start a project <ArrowUpRight size={17} />
            </a>
            <a href="#work" className="text-link button-outline">
              View my work <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="contact-layout" id="project-form">
          <div className="contact-intro">
            <span className="mono">A GOOD CONVERSATION IS A GOOD START.</span>
            <h3>
              Tell me what
              <br />
              you’re thinking.
            </h3>
            <p>
              A little context goes a long way. Share your idea, your existing
              store, or the problem you want to solve.
            </p>
            <div className="contact-person">
              <Asterisk size={32} />
              <div>
                <strong>{profile.name}</strong>
                <span>Shopify Developer · Your next collaborator</span>
              </div>
            </div>
            {profile.email && (
              <a className="text-link" href={`mailto:${profile.email}`}>
                {profile.email}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
          <form onSubmit={submit} noValidate className="contact-form">
            <div className="form-row">
              <label htmlFor="contact-name">
                Your name <span>*</span>
                <input
                  {...fieldProps("name")}
                  placeholder="What should I call you?"
                  autoComplete="name"
                  maxLength={100}
                  required
                />
                {error("name")}
              </label>
              <label htmlFor="contact-email">
                Email address <span>*</span>
                <input
                  {...fieldProps("email")}
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
                {error("email")}
              </label>
            </div>
            <div className="form-row">
              <label htmlFor="contact-company">
                Company
                <input
                  {...fieldProps("company")}
                  placeholder="Your brand or business"
                  autoComplete="organization"
                  maxLength={150}
                />
                {error("company")}
              </label>
              <label htmlFor="contact-storeUrl">
                Store URL
                <input
                  {...fieldProps("storeUrl")}
                  type="url"
                  placeholder="https://yourstore.com"
                  maxLength={500}
                />
                {error("storeUrl")}
              </label>
            </div>
            <div className="form-row">
              <label htmlFor="contact-platform">
                Current platform
                <select {...fieldProps("platform")} defaultValue="">
                  <option value="">Choose your starting point</option>
                  {[
                    "Starting from scratch",
                    "Shopify",
                    "Shopify Plus",
                    "WooCommerce",
                    "Magento",
                    "BigCommerce",
                    "Wix",
                    "Squarespace",
                    "Other",
                  ].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="contact-projectType">
                What can I help with? <span>*</span>
                <select {...fieldProps("projectType")} defaultValue="" required>
                  <option value="">Select a project type</option>
                  {projectTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                {error("projectType")}
              </label>
            </div>
            <label htmlFor="contact-budget">
              Budget range (USD)
              <select {...fieldProps("budget")} defaultValue="">
                <option value="">Let’s discuss it</option>
                <option>Under $2,500</option>
                <option>$2,500–$5,000</option>
                <option>$5,000–$10,000</option>
                <option>$10,000+</option>
              </select>
            </label>
            <label htmlFor="contact-message">
              A little about your project <span>*</span>
              <textarea
                {...fieldProps("message")}
                rows={4}
                placeholder="The idea, the challenge, the possibilities…"
                minLength={20}
                maxLength={5000}
                required
              />
              {error("message")}
            </label>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="contact-website">
                Leave this field empty
                <input
                  id="contact-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="form-bottom">
              <p>
                Your details are only used to respond
                <br />
                to your enquiry. No mailing lists.
              </p>
              <button
                className="button button-dark"
                type="submit"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    Sending <LoaderCircle className="spin" size={17} />
                  </>
                ) : (
                  <>
                    Let’s talk <ArrowUpRight size={17} />
                  </>
                )}
              </button>
            </div>
            {feedback && (
              <div
                className={`form-feedback ${status}`}
                role={status === "error" ? "alert" : "status"}
              >
                {status === "success" && <Check size={18} />}
                <span>{feedback}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
