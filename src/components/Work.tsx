"use client";
import { Fragment, useState, type CSSProperties } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { SectionLabel, SafeImage, Modal } from "./shared";
import { track } from "@/lib/analytics";
export default function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const featuredProjects = projects.filter((project) => project.featured);
  const allConcepts = projects.every((project) => project.concept);
  return (
    <section className="work-section section-pad container" id="work">
      <div className="section-heading">
        <div>
          <SectionLabel>
            {allConcepts ? "SELECTED EXPLORATIONS / 01" : "SELECTED WORK / 01"}
          </SectionLabel>
          <h2>
            Good stores.
            <br />
            <span className="muted">Distinct personalities.</span>
          </h2>
        </div>
        <div className="heading-aside">
          <p>
            Built around the brand, the customer,
            <br />
            and the business behind them.
          </p>
          <span className="small-note">
            {allConcepts
              ? "CONCEPT WORK. REAL POSSIBILITIES."
              : "INDIVIDUAL BRANDS. CONSIDERED EXPERIENCES."}
          </span>
        </div>
      </div>
      <div
        className="project-grid"
        style={
          {
            "--work-rows": Math.max(1, featuredProjects.length - 1),
          } as CSSProperties
        }
      >
        {featuredProjects.map((project, i) => (
          <article className={`project project-${i}`} key={project.slug}>
            <button
              className="project-visual"
              onClick={() => {
                setSelected(project);
                track("work_project", { project: project.slug });
              }}
              aria-label={`Explore ${project.title} ${project.concept ? "concept" : "project"}`}
            >
              <div className="project-topline">
                <span>
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {project.concept ? "CONCEPT STOREFRONT" : "SELECTED PROJECT"}
                </span>
                <ArrowUpRight size={19} />
              </div>
              <SafeImage
                src={project.thumbnail}
                alt={`${project.title}: ${project.industry.toLowerCase()} ${project.concept ? "concept" : "storefront"}`}
              />
              {project.presentation && (
                <div className="project-brand">
                  <span>{project.industry.toUpperCase()}</span>
                  <strong>
                    {project.presentation.titleLines.map((line, index) => (
                      <Fragment key={line}>
                        {index > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </strong>
                  <span>{project.presentation.tagline}</span>
                </div>
              )}
              <span className="project-open">
                {project.concept ? "Explore concept" : "View project"}{" "}
                <ArrowUpRight size={17} />
              </span>
            </button>
            <div className="project-meta">
              <div>
                <h3>{project.title}</h3>
                <p>{project.services.join(" / ")}</p>
              </div>
              <span>
                {project.platform.toUpperCase()} <ArrowUpRight size={13} />
              </span>
            </div>
          </article>
        ))}
      </div>
      {!projects.some((project) => project.featured) && (
        <p className="empty-state">Projects are being prepared.</p>
      )}
      <div className="work-footnote">
        <span>
          {allConcepts
            ? "These self-initiated concepts explore what a considered storefront can be."
            : "Explore the thinking, details, and development behind each storefront."}
        </span>
        <a href="#contact">
          Let’s create something that’s yours <ArrowUpRight size={16} />
        </a>
      </div>
      {selected && (
        <Modal
          title={`${selected.title} ${selected.concept ? "concept details" : "project details"}`}
          onClose={() => setSelected(null)}
        >
          <div className="project-dialog">
            <SafeImage
              src={selected.heroImage}
              alt={`${selected.title} ${selected.concept ? "concept visual" : "storefront"}`}
            />
            <div className="project-dialog-copy">
              <SectionLabel>
                {selected.concept
                  ? "SELF-INITIATED CONCEPT / NOT CLIENT WORK"
                  : `${selected.platform.toUpperCase()} / ${selected.projectType.toUpperCase()}`}
              </SectionLabel>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
              <div className="project-detail-grid">
                <div>
                  <h3>
                    {selected.concept ? "The exploration" : "The challenge"}
                  </h3>
                  <p>{selected.challenge}</p>
                </div>
                <div>
                  <h3>The approach</h3>
                  <p>{selected.solution}</p>
                </div>
              </div>
              <h3>
                {selected.concept ? "Inside the concept" : "Inside the store"}
              </h3>
              <ul>
                {selected.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              {selected.concept && (
                <p className="small-note">
                  Illustrative work only. No client relationship or measured
                  commercial results are claimed.
                </p>
              )}
              {selected.outcome && (
                <div className="project-outcome">
                  <h3>The outcome</h3>
                  <p>{selected.outcome}</p>
                </div>
              )}
              {selected.gallery.map((image, index) => (
                <SafeImage
                  key={image}
                  src={image}
                  alt={`${selected.title}, project view ${index + 1}`}
                />
              ))}
              <a
                className="button button-accent"
                href="#contact"
                onClick={() => setSelected(null)}
              >
                Build something like this <ArrowRight size={17} />
              </a>
              {selected.externalUrl && (
                <a
                  href={selected.externalUrl}
                  onClick={() =>
                    track("external_store", { project: selected.slug })
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit store ↗
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
