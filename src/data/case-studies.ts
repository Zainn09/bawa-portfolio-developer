import { articles } from "@/data/blog";
import { projects } from "@/data/portfolio";

export interface CaseStudySection {
  heading: string;
  body: string[];
}

export interface CaseStudyData {
  project: string;
  h1: string;
  h1Accent: string;
  role: string;
  sections: CaseStudySection[];
  note?: string;
}

const raw: CaseStudyData[] = [
  {
    project: "prime-baby-gear",
    h1: "Prime Baby Gear",
    h1Accent: "development & QA case study",
    role: "Development and quality assurance on the storefront.",
    sections: [
      {
        heading: "The store",
        body: [
          "A baby gear storefront bringing together pushchairs, travel systems, car seats, and essentials for growing families. The catalogue’s real complication is that a travel system is several products families buy together, so the information architecture has to hold cross-sold items without turning into a matrix.",
        ],
      },
      {
        heading: "What the development work centres on",
        body: [
          "The journal’s Prime Baby Gear entries follow the storefront’s actual structure: how the catalogue is entered, how a travel system is presented as more than a single item, what the mobile menu is responsible for, and how product records stay readable behind the pushchair pages.",
          "The testing side runs against that same structure. Collection pages are checked for the data they carry, the hero is kept light rather than decorative, and the reassurance copy is verified against what it actually explains.",
        ],
      },
      {
        heading: "How the work is documented",
        body: [
          "Every decision below links to the journal article where it is worked through in full, including the screenshots captured from the public storefront. The articles describe the public store and the reasoning applied to it — no performance numbers are claimed, because none were measured.",
        ],
      },
    ],
  },
  {
    project: "ollie-burwell",
    h1: "Ollie Burwell",
    h1Accent: "development & QA case study",
    role: "Development and quality assurance on the storefront.",
    sections: [
      {
        heading: "The store",
        body: [
          "A fashion house where the product is partly the story around it: luxury sarongs, scarves, and resort wear, with styling guides attached to the garments themselves. That makes the styling guide a functional part of the product experience rather than marketing on the side.",
        ],
      },
      {
        heading: "What the development work centres on",
        body: [
          "The journal’s Ollie Burwell entries track the hard parts of that model: giving the styling story a searchable structure without turning it into a blog, choosing one clear route when material, occasion, and garment all want to be a navigation label, and keeping fashion photography composed for mobile.",
          "The theme work focuses on the quiet mechanics — the product template doing its job without shouting, seasonal edits being managed as living sections instead of expired aisles, and copy that describes the craft without burying the product.",
        ],
      },
      {
        heading: "How the work is documented",
        body: [
          "Each linked article is based on the public storefront, with captured screenshots as evidence. The entries document the approach and the reasoning; they do not claim conversion or traffic results, because none were measured.",
        ],
      },
    ],
  },
  {
    project: "nokoluxe",
    h1: "Nokoluxe",
    h1Accent: "development & QA case study",
    role: "Development and quality assurance on the storefront.",
    sections: [
      {
        heading: "The store",
        body: [
          "An outdoor living store spanning furniture, poolside pieces, fire tables, outdoor cooking, and spa collections. The catalogue is wide and the decisions it supports are expensive, so the storefront has to separate brand ranges from functional categories without saying the same thing twice.",
        ],
      },
      {
        heading: "What the development work centres on",
        body: [
          "The journal’s Nokoluxe entries centre on information models at catalogue scale: a fire-table collection that needs its own data structure, colour names treated as part of the product interface, and a loading budget for a catalogue this large.",
          "The QA side checks the same structures from the customer’s side — how the room is shown without crowding the furniture, how the questions beside a large purchase are answered on the page, and how brand ranges and categories behave under search.",
        ],
      },
      {
        heading: "How the work is documented",
        body: [
          "The linked articles work through each decision with screenshots from the public storefront. They document the structure and the reasoning behind it, without claiming metrics that were never measured.",
        ],
      },
    ],
  },
  {
    project: "vintage-art-garage",
    h1: "Vintage Art Garage",
    h1Accent: "development & QA case study",
    role: "Development and quality assurance on the storefront.",
    note: "The public store is temporarily closed while the owners travel. Its website currently displays a reopening notice, so this case study documents the work around the storefront rather than its live state.",
    sections: [
      {
        heading: "The store",
        body: [
          "A specialist store for vintage automotive advertising and framed prints, built around the character of classic car culture. The product model is the interesting part: the same artwork can be sold as a print or framed, so the catalogue has to hold the artwork and the object as one decision.",
        ],
      },
      {
        heading: "What the development work centres on",
        body: [
          "The journal’s Vintage Art Garage entries treat the closure as part of the work: how a temporary closure reads as a customer experience, what the product data a vintage print deserves, and the checklist that runs before the storefront opens again.",
          "The theme side covers the frame choices and the product model behind them, while the content side covers showing the artwork and the object without keyword stuffing the catalogue.",
        ],
      },
      {
        heading: "How the work is documented",
        body: [
          "Because the store is closed, no current screenshots are presented. The linked articles explain the approach and the captured evidence that was approved while the store was available, and they state plainly where nothing is implied.",
        ],
      },
    ],
  },
  {
    project: "paw-by-four",
    h1: "Paw by Four",
    h1Accent: "development & QA case study",
    role: "Development and quality assurance on the storefront.",
    sections: [
      {
        heading: "The store",
        body: [
          "A canine care store combining educational resources, digital guides, and enrichment products for owners of anxious dogs. The storefront serves two kinds of readiness at once — customers who need an answer now, and customers who are ready to buy.",
        ],
      },
      {
        heading: "What the development work centres on",
        body: [
          "The journal’s Paw by Four entries follow that dual purpose: a homepage that offers two actions for two kinds of readiness, a resource library built as a structure rather than a pile of articles, and copy that stays calm when the customer is worried.",
          "The development entries cover the two fulfilment expectations the store carries — digital guides and physical products — and what the product page has to explain before the benefit.",
        ],
      },
      {
        heading: "How the work is documented",
        body: [
          "Each linked article is grounded in the public storefront with captured screenshots. They document the approach, including what happens to a resource after it is published, without claiming results that were not measured.",
        ],
      },
    ],
  },
];

export const caseStudySlugs = raw.map((c) => c.project);

export type CaseStudy = CaseStudyData & {
  projectTitle: string;
  projectDescription: string;
  note?: string;
  articles: (typeof articles)[number][];
};

export const caseStudies: CaseStudy[] = raw.map((study) => {
  const project = projects.find((p) => p.slug === study.project)!;
  return {
    ...study,
    projectTitle: project.title,
    projectDescription: project.description,
    note: project.siteNote ?? study.note,
    articles: articles.filter((a) => a.project === study.project),
  };
});

export const caseStudyBySlug: Record<string, CaseStudy> = Object.fromEntries(
  caseStudies.map((c) => [c.project, c]),
);
