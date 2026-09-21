"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login({ configured }: { configured: boolean }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      router.replace("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main" className="cms-login">
      <Link className="cms-back" href="/">
        ← Back to the portfolio
      </Link>
      <section>
        <span className="cms-eyebrow">AHMAD ABDULLAH / JOURNAL</span>
        <h1>
          A place for
          <br />
          your next idea.
        </h1>
        <p>
          Sign in to write, refine, and publish. Access is limited to approved
          administrators.
        </p>
        {!configured ? (
          <div className="cms-notice">
            <strong>Connect Supabase to enable sign-in.</strong>
            <p>
              Set the project URL and publishable key in private deployment
              settings, run the database migration, and grant your account
              administrator access. Follow <code>docs/BLOG-DASHBOARD.md</code>{" "}
              in the repository.
            </p>
            <p>No demo login or public registration is enabled.</p>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="username"
                required
                maxLength={254}
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={256}
              />
            </label>
            {error && (
              <p role="alert" className="cms-error">
                {error}
              </p>
            )}
            <button className="cms-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in to the journal"}
            </button>
            <p className="cms-help">
              Account access and password resets are managed through your
              Supabase project owner. There is no public sign-up.
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
