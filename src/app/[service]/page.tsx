import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/ServicePage";
import { serviceBySlug, servicePages } from "@/data/services";

export const dynamicParams = false;
type Props = { params: Promise<{ service: string }> };
const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function generateStaticParams() {
  return servicePages.map((page) => ({ service: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service } = await params;
  const page = serviceBySlug[service];
  if (!page)
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  return {
    title: page.title,
    description: page.description,
    ...(site ? { alternates: { canonical: `/${service}` } } : {}),
    openGraph: {
      type: "website",
      title: page.title,
      description: page.description,
      ...(site ? { url: `/${service}` } : {}),
    },
    robots: { index: Boolean(site), follow: Boolean(site) },
  };
}

export default async function ServiceRoutePage({ params }: Props) {
  const { service } = await params;
  const page = serviceBySlug[service];
  if (!page) notFound();
  return <ServicePage data={page} slug={service} site={site} />;
}
