"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BookOpen, LogOut } from "lucide-react";
export default function AdminFrame({
  children,
  email,
  live,
}: {
  children: React.ReactNode;
  email: string;
  live: boolean;
}) {
  const router = useRouter();
  async function signOut() {
    if (
      !window.dispatchEvent(new Event("cms:before-leave", { cancelable: true }))
    )
      return;
    const r = await fetch("/api/admin/session", { method: "DELETE" });
    if (r.ok) {
      router.replace("/admin/login");
      router.refresh();
    } else alert("Could not sign out. Please try again.");
  }
  return (
    <div className="cms-shell">
      <aside className="cms-sidebar" aria-label="Workspace navigation">
        <Link href="/admin" className="cms-brand">
          AA
          <span>
            Journal
            <br />
            <small>EDITORIAL WORKSPACE</small>
          </span>
        </Link>
        <nav aria-label="Administration">
          <Link href="/admin">
            <BookOpen size={18} /> Articles
          </Link>
          <Link href="/blogs" target="_blank">
            View journal <ArrowUpRight size={16} />
          </Link>
          <Link href="/" target="_blank">
            View portfolio <ArrowUpRight size={16} />
          </Link>
        </nav>
        <div className="cms-account">
          <span>{email}</span>
          <button onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main id="main" className="cms-main">
        {!live && (
          <div className="cms-notice">
            Setup mode · The public site still uses the supplied articles.
            Import them here, then set <code>BLOG_CONTENT_SOURCE=database</code>{" "}
            in your deployment to enable live publishing.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
