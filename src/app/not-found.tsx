import { ArrowLeft, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <div className="container">
        <span className="journal-kicker">404 — PAGE NOT FOUND</span>
        <h1>
          This page isn’t
          <br />
          <span>in the catalogue.</span>
        </h1>
        <p>
          The link may be old, or the page may have moved. The work, the
          journal, and the services are all where you left them.
        </p>
        <div className="not-found-actions">
          <a href="/" className="not-found-back">
            <ArrowLeft size={16} /> Back to the start
          </a>
          <a href="/shopify-development">Services</a>
          <a href="/case-studies">Case studies</a>
          <a href="/blogs">Journal</a>
          <a href="/#contact">
            Start a conversation <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </main>
  );
}
