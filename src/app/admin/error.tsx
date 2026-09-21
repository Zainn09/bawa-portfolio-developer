"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="cms-login">
      <section>
        <h1>The workspace couldn’t load.</h1>
        <p>
          Check your connection and database setup, then try again. No edits
          have been discarded by the server.
        </p>
        <button className="cms-primary" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
