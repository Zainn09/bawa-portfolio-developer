import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourcePage from "@/components/ResourcePage";
import { resourceBySlug, resourceSlugs } from "@/data/resources";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };
const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function generateStaticParams() {
  return resourceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = resourceBySlug[slug];
  if (!resource)
    return {
      title: "Resource not found",
      robots: { index: false, follow: false },
    };
  return {
    title: resource.title,
    description: resource.description,
    ...(site ? { alternates: { canonical: `/resources/${slug}` } } : {}),
    openGraph: {
      type: "website",
      title: resource.title,
      description: resource.description,
      ...(site ? { url: `/resources/${slug}` } : {}),
    },
    robots: { index: Boolean(site), follow: Boolean(site) },
  };
}

export default async function ResourceRoutePage({ params }: Props) {
  const { slug } = await params;
  const resource = resourceBySlug[slug];
  if (!resource) notFound();
  return <ResourcePage data={resource} site={site} />;
}
