import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/CaseStudyPage";
import { caseStudyBySlug, caseStudySlugs } from "@/data/case-studies";
import { siteUrl as site } from "@/lib/site";

export const dynamicParams = false;
type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug[slug];
  if (!study)
    return {
      title: "Case study not found",
      robots: { index: false, follow: false },
    };
  return {
    title: `${study.projectTitle} Case Study — Shopify Development & QA | Ahmad Abdullah`,
    description: `${study.projectDescription} Development and QA case study, documented through the journal with captured storefront evidence.`,
    ...(site ? { alternates: { canonical: `/case-studies/${slug}` } } : {}),
    openGraph: {
      type: "website",
      title: `${study.projectTitle} Case Study — Shopify Development & QA`,
      description: study.projectDescription,
      ...(site ? { url: `/case-studies/${slug}` } : {}),
    },
    robots: { index: Boolean(site), follow: Boolean(site) },
  };
}

export default async function CaseStudyRoutePage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudyBySlug[slug];
  if (!study) notFound();
  return <CaseStudyPage data={study} site={site} />;
}
