"use client";
export default function JournalError({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container section-pad">
      <h1>The journal is temporarily unavailable.</h1>
      <p>Please try again shortly.</p>
      <button className="button button-outline" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
