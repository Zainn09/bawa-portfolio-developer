import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/data/portfolio";
export default function JournalFooter() {
  return (
    <footer className="journal-footer">
      <div className="container">
        <div>
          <span>FROM THE JOURNAL TO YOUR STORE</span>
          <h2>
            Good questions.
            <br />
            <em>Better commerce.</em>
          </h2>
          <Link href="/#contact">
            Let’s talk about your store <ArrowUpRight size={20} />
          </Link>
        </div>
        <div className="journal-footer-bottom">
          <Link href="/">
            {profile.name} / {profile.title}
          </Link>
          <nav aria-label="Journal footer">
            <Link href="/blogs">All articles</Link>
            <Link href="/#work">Selected work</Link>
            <Link href="/#contact">Start a project</Link>
          </nav>
          <span>Built for commerce. Refined through detail.</span>
        </div>
      </div>
    </footer>
  );
}
