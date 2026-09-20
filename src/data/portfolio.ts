/** Replace these fields with real information before publishing. Empty proof sections stay hidden. */
export const profile = {
  name: "Ahmad Abdullah",
  title: "Shopify Developer",
  introduction:
    "I specialize in building and optimizing Shopify stores that combine considered design with reliable development, search visibility, and conversion-focused experiences.",
  image: "/images/profile-placeholder.webp",
  email: "",
  socials: [] as { label: string; url: string }[],
};
export const images = {
  hero: "/images/hero-store-placeholder.webp",
  heroSmall: "/images/hero-store-small.webp",
};
export interface Project {
  presentation?: { titleLines: string[]; tagline: string };
  title: string;
  slug: string;
  industry: string;
  platform: string;
  platformVersion: string;
  projectType: string;
  description: string;
  thumbnail: string;
  heroImage: string;
  gallery: string[];
  services: string[];
  technologies: string[];
  challenge: string;
  solution: string;
  features: string[];
  seoWork: string[];
  croWork: string[];
  developmentWork: string[];
  outcome: string;
  externalUrl: string;
  featured: boolean;
  concept: boolean;
  beforeImage?: string;
  afterImage?: string;
}
const base = {
  platform: "Shopify",
  platformVersion: "",
  gallery: [],
  technologies: ["Liquid", "JavaScript", "CSS"],
  outcome: "",
  externalUrl: "",
  featured: true,
  concept: true,
  seoWork: ["Semantic page structure", "Product metadata"],
  croWork: ["Clear product discovery", "Accessible shopping interactions"],
  developmentWork: ["Custom sections", "Responsive templates"],
};
export const projects: Project[] = [
  {
    ...base,
    title: "Form & Field",
    presentation: {
      titleLines: ["form&field."],
      tagline: "Considered objects. Everyday living.",
    },
    slug: "form-and-field",
    industry: "Furniture & living",
    projectType: "Custom storefront concept",
    description:
      "A quieter way to shop. An editorial furniture concept built around natural materials and intentional living.",
    thumbnail: images.hero,
    heroImage: images.hero,
    services: ["Custom theme", "UX / UI", "Development"],
    challenge:
      "Explore how a furniture store can balance an editorial brand experience with straightforward product discovery.",
    solution:
      "A warm, spacious storefront with material-led storytelling, clear product information, and a focused cart experience.",
    features: [
      "Interactive demo cart",
      "Responsive product presentation",
      "Material-focused merchandising",
    ],
    beforeImage: "/images/before-after/before-01.webp",
    afterImage: "/images/before-after/after-01.webp",
  },
  {
    ...base,
    title: "Objects of Gold",
    presentation: {
      titleLines: ["Objects", "of Gold."],
      tagline: "Extraordinary, every day.",
    },
    slug: "objects-of-gold",
    industry: "Jewellery",
    projectType: "Brand-led commerce concept",
    description:
      "Sculptural pieces. A considered storefront. A jewellery concept where the details do the talking.",
    thumbnail: "/images/projects/project-01-placeholder.webp",
    heroImage: "/images/projects/project-01-placeholder.webp",
    services: ["Art direction", "Custom theme", "Product experience"],
    challenge:
      "Give small, tactile objects a strong digital presence without overwhelming the shopping experience.",
    solution:
      "Large product imagery, restrained typography, and a clear path from collection to product.",
    features: [
      "Editorial collection concept",
      "Product storytelling",
      "Mobile-first layout",
    ],
  },
  {
    ...base,
    title: "Rooted Rituals",
    presentation: {
      titleLines: ["rooted", "rituals."],
      tagline: "A return to the essentials.",
    },
    slug: "rooted-rituals",
    industry: "Beauty & wellness",
    projectType: "Product storytelling concept",
    description:
      "Botanical essentials, thoughtfully presented. An exploration in content-led beauty commerce.",
    thumbnail: "/images/projects/project-02-placeholder.webp",
    heroImage: "/images/projects/project-02-placeholder.webp",
    services: ["Store design", "Content structure", "Mobile UX"],
    challenge:
      "Make product ingredients and everyday routines easy to understand and explore.",
    solution:
      "A botanical visual identity with useful product education and a simplified content hierarchy.",
    features: [
      "Routine-led collections",
      "Ingredient storytelling",
      "Clear product navigation",
    ],
  },
];
export const capabilities = [
  {
    title: "Store development",
    subtitle: "Built around your brand. Not the other way around.",
    description:
      "Custom Shopify themes and storefront experiences, from the first section to the final cart interaction.",
    items: [
      "Custom Shopify themes",
      "Liquid & custom sections",
      "Product & collection templates",
      "Responsive components",
      "Cart experiences",
      "Custom functionality",
    ],
  },
  {
    title: "Store setup & migration",
    subtitle: "A considered foundation for everything that follows.",
    description:
      "A well-organized store from day one, with practical migration planning and a configuration that fits your business.",
    items: [
      "Store configuration",
      "Navigation & collections",
      "Products & variants",
      "Metafields",
      "Platform migration",
      "Redirect planning",
    ],
  },
  {
    title: "Product data",
    subtitle: "The little details that make a store work.",
    description:
      "Clean, consistent product information that helps customers find, understand, and choose the right product.",
    items: [
      "Product data entry",
      "Bulk data preparation",
      "Variant setup",
      "Image organization",
      "Content entry",
      "Collection organization",
    ],
  },
  {
    title: "SEO & discoverability",
    subtitle: "Built to be found, not just admired.",
    description:
      "Search fundamentals woven into the store architecture, rather than bolted on at the end.",
    items: [
      "Technical SEO",
      "Product & collection metadata",
      "Heading structure",
      "Internal linking",
      "Image optimization",
      "Appropriate structured data",
    ],
  },
  {
    title: "Conversion experience",
    subtitle: "Less friction. More considered decisions.",
    description:
      "Clear journeys that help shoppers move confidently from their first visit to checkout.",
    items: [
      "Product page optimization",
      "CTA placement",
      "Product discovery",
      "Navigation & filters",
      "Mobile shopping UX",
      "Checkout friction analysis",
    ],
  },
  {
    title: "Performance",
    subtitle: "Because every interaction should feel effortless.",
    description:
      "Thoughtful optimization of the assets, code, and loading experience behind your storefront.",
    items: [
      "Image optimization",
      "JavaScript & CSS optimization",
      "Core Web Vitals awareness",
      "App impact review",
      "Mobile performance",
      "Loading experience",
    ],
  },
  {
    title: "Ongoing management",
    subtitle: "A launch is a beginning, not a goodbye.",
    description:
      "Practical support that keeps your store current, functional, and ready for what comes next.",
    items: [
      "Product & content updates",
      "Theme maintenance",
      "Bug fixing",
      "Feature changes",
      "SEO maintenance",
      "Ongoing optimization",
    ],
  },
];
export const platforms = [
  {
    name: "Magento",
    category: "Enterprise e-commerce",
    note: "Migration planning for complex catalogs, product attributes, and URL structures.",
  },
  {
    name: "WooCommerce",
    category: "WordPress commerce",
    note: "Bring product content, collections, and customer journeys into a Shopify-first structure.",
  },
  {
    name: "BigCommerce",
    category: "Hosted e-commerce",
    note: "Map products, variants, content, and integrations before planning a transition.",
  },
  {
    name: "WordPress",
    category: "Content management",
    note: "Consider content, redirects, and the relationship between editorial and commerce.",
  },
  {
    name: "Wix",
    category: "Website & commerce",
    note: "Plan a clear, manageable catalog and storefront transition.",
  },
  {
    name: "Squarespace",
    category: "Design-led websites",
    note: "Carry the brand identity into a commerce-focused storefront.",
  },
  {
    name: "PrestaShop",
    category: "Open-source commerce",
    note: "Review catalog structure, custom functionality, and integration requirements.",
  },
  {
    name: "OpenCart",
    category: "Open-source commerce",
    note: "Audit product data and store workflows before deciding on a migration approach.",
  },
  {
    name: "Custom Commerce",
    category: "Bespoke platforms",
    note: "Start with a technical audit and a plan for business-specific functionality.",
  },
];
export const process = [
  {
    name: "Discover",
    title: "Start with the right questions.",
    text: "Understand your brand, customers, products, and what the store needs to do.",
  },
  {
    name: "Plan",
    title: "Give the experience a structure.",
    text: "Map navigation, collections, page types, integrations, and a practical scope.",
  },
  {
    name: "Design",
    title: "Make the brand feel at home.",
    text: "Bring typography, imagery, and the shopping journey into one coherent visual direction.",
  },
  {
    name: "Develop",
    title: "Turn the design into a working store.",
    text: "Build reusable sections, custom templates, responsive layouts, and useful interactions.",
  },
  {
    name: "Populate",
    title: "Put every product in its place.",
    text: "Prepare products, variants, images, collections, metafields, and content.",
  },
  {
    name: "Optimize",
    title: "Look beneath the surface.",
    text: "Refine technical SEO, page loading, product discovery, and the path to purchase.",
  },
  {
    name: "Test",
    title: "Make the details dependable.",
    text: "Review real device layouts, keyboard access, forms, navigation, cart, and integrations.",
  },
  {
    name: "Launch",
    title: "Open the doors, thoughtfully.",
    text: "Check domains, redirects, payment configuration, tracking, and launch readiness.",
  },
  {
    name: "Maintain",
    title: "Keep the experience moving forward.",
    text: "Support content updates, theme maintenance, bug fixes, and ongoing improvements.",
  },
];
export const projectTypes = [
  "New Shopify Store",
  "Shopify Redesign",
  "Custom Theme",
  "Shopify Migration",
  "Store Management",
  "SEO",
  "CRO",
  "Performance",
  "Data Entry",
  "Bug Fixing",
  "Other",
];
export const testimonials: {
  name: string;
  role: string;
  company: string;
  quote: string;
  image?: string;
  date: string;
  projectReference?: string;
}[] = [];
export const clientLogos: { name: string; image: string; url?: string }[] = [];
export const statistics: { label: string; value: string }[] = [];

export const imageVariants: Record<string, string> = {
  [images.hero]: images.heroSmall,
  "/images/projects/project-01-placeholder.webp":
    "/images/projects/project-01-small.webp",
  "/images/projects/project-02-placeholder.webp":
    "/images/projects/project-02-small.webp",
};
