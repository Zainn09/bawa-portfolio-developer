import type { Metadata } from "next";
import "@/styles/admin.css";
export const metadata: Metadata = {
  title: "Journal administration",
  robots: { index: false, follow: false },
  referrer: "same-origin",
};
export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
