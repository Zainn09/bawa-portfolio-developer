import Link from "next/link";
export default function ArticleNotFound() {
  return (
    <main id="main" className="journal-not-found container">
      <span className="journal-kicker">404 / A MISSING PAGE</span>
      <h1>
        This note isn’t
        <br />
        on the shelf.
      </h1>
      <p>The article may have moved, or the link may be incomplete.</p>
      <Link href="/blogs" className="button button-outline">
        Return to the journal ↗
      </Link>
    </main>
  );
}
