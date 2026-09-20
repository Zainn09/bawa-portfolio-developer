import prime from "./prime-baby-gear.json";
import ollie from "./ollie-burwell.json";
import noko from "./nokoluxe.json";
import vintage from "./vintage-art-garage.json";
import paw from "./paw-by-four.json";
import assetData from "./assets.json";

export interface BlogMedia {
  src?: string;
  width: number;
  height: number;
  alt: string;
  smallSrc?: string;
  smallWidth?: number;
  avifSrc?: string;
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
  objectPosition?: string;
  caption?: string;
  capturedAt?: string;
  sourcePath?: string;
}
export interface ArticleSource {
  label: string;
  url: string;
}
export interface ArticleInput {
  title: string;
  slug: string;
  project: string;
  category: string;
  tags: string[];
  excerpt: string;
  intro: string;
  featuredImage: string;
  sections: { heading: string; paragraphs: string[] }[];
  takeaway: string;
  mobileGallery: boolean;
  publishedAt: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt?: string;
  inlineImages?: string[];
  comparisonImages?: string[];
}
export interface Article extends Omit<
  ArticleInput,
  "featuredImage" | "inlineImages" | "comparisonImages"
> {
  featuredImage: BlogMedia;
  inlineImages: BlogMedia[];
  comparisonImages: BlogMedia[];
  mobileImages: BlogMedia[];
  readingMinutes: number;
  sources: ArticleSource[];
}
export interface ArticleSummary {
  title: string;
  slug: string;
  project: string;
  category: string;
  tags: string[];
  excerpt: string;
  featuredImage: BlogMedia;
  readingMinutes: number;
  publishedAt: string;
}
export const blogProjects = [
  {
    slug: "prime-baby-gear",
    name: "Prime Baby Gear",
    url: "https://www.primebabygear.com/",
    focus: "Baby gear & family",
  },
  {
    slug: "ollie-burwell",
    name: "Ollie Burwell",
    url: "https://www.ollieburwell.com/",
    focus: "Fashion & resort wear",
  },
  {
    slug: "nokoluxe",
    name: "Noko Luxe",
    url: "https://www.nokoluxe.com/",
    focus: "Outdoor living",
  },
  {
    slug: "vintage-art-garage",
    name: "Vintage Art Garage",
    url: "https://www.vintageartgarage.com/",
    focus: "Vintage automotive art",
  },
  {
    slug: "paw-by-four",
    name: "Paw by Four",
    url: "https://www.pawbyfour.com/",
    focus: "Pet care & education",
  },
];
export const sourceArchive =
  "https://github.com/Zainn09/portfolio-images/blob/arena/01a0c0f5-portfolio-images/QA-Portfolio-Sprint-11-Assets.zip";
const assets: Record<string, Record<string, BlogMedia>> = assetData;
export function getBlogMedia(
  project: string,
  key: string,
  mobile = false,
): BlogMedia {
  return (
    assets[project]?.[key] || {
      width: mobile ? 390 : 1600,
      height: mobile ? 844 : 1000,
      alt: `${blogProjects.find((p) => p.slug === project)?.name || project} ${mobile ? "mobile screenshot" : "project image"} placeholder`,
      caption: "Approved project imagery pending. No screenshot is implied.",
    }
  );
}
const input: ArticleInput[] = [...prime, ...ollie, ...noko, ...vintage, ...paw];
export const articles: Article[] = input
  .filter((a) => a.status === "published")
  .map((a) => {
    const project = blogProjects.find((p) => p.slug === a.project)!;
    const words = [
      a.title,
      a.excerpt,
      a.intro,
      a.takeaway,
      ...a.sections.flatMap((s) => [s.heading, ...s.paragraphs]),
    ]
      .join(" ")
      .split(/\s+/).length;
    const mobileKeys = Object.keys(assets[a.project] || {}).filter(
      (k) =>
        k.startsWith("mobile-") &&
        (k.includes("home-hero") || k.includes("detail")),
    );
    return {
      ...a,
      featuredImage: getBlogMedia(a.project, a.featuredImage),
      inlineImages: (a.inlineImages || []).map((key) =>
        getBlogMedia(a.project, key),
      ),
      comparisonImages: (a.comparisonImages || []).map((key) =>
        getBlogMedia(a.project, key),
      ),
      mobileImages: a.mobileGallery
        ? (mobileKeys.length
            ? mobileKeys
            : ["mobile-home-hero", "mobile-product-detail"]
          )
            .slice(0, 2)
            .map((k) => getBlogMedia(a.project, k, true))
        : [],
      readingMinutes: Math.max(1, Math.ceil(words / 200)),
      sources: [
        { label: project.name + " — public website", url: project.url },
        {
          label: "Supplied project capture archive · 20 September 2026",
          url: sourceArchive,
        },
      ],
    };
  });
export function summarize(article: Article): ArticleSummary {
  const {
    title,
    slug,
    project,
    category,
    tags,
    excerpt,
    featuredImage,
    readingMinutes,
    publishedAt,
  } = article;
  return {
    title,
    slug,
    project,
    category,
    tags,
    excerpt,
    featuredImage,
    readingMinutes,
    publishedAt,
  };
}
export function articleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
export function relatedArticles(article: Article) {
  return articles
    .filter((a) => a.project === article.project && a.slug !== article.slug)
    .slice(0, 3);
}
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value + "T12:00:00Z"));
