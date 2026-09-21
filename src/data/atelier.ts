/** Fictional, clearly labeled art-direction studies. No client relationships or outcomes. */
export interface StoreConcept {
  id: string;
  name: string;
  industry: string;
  mood: string;
  description: string;
  announcement: string;
  image: string;
  smallImage: string;
  imageAlt: string;
  headline: string[];
  detailHeadline: string[];
  storyHeadline: string[];
  supporting: string;
  story: string;
  eyebrow: string;
  product: string;
  material: string;
  price: number;
  palette: string[];
}
export const storeConcepts: StoreConcept[] = [
  {
    id: "furniture",
    name: "form&field.",
    industry: "Furniture & living",
    mood: "Quiet / tactile / considered",
    description:
      "Room to breathe. Natural textures. A slower, more intentional way to shop.",
    announcement: "Considered objects. Everyday living.",
    image: "/images/hero-store-placeholder.webp",
    smallImage: "/images/hero-store-small.webp",
    imageAlt: "Oak and ivory lounge chair in a sunlit interior",
    headline: ["A little less.", "A little better."],
    detailHeadline: ["Made to settle in.", "Built to stay."],
    storyHeadline: ["Objects with", "a little soul."],
    supporting: "Thoughtful pieces for the spaces we call home.",
    story: "A concept in intentional living and natural materials.",
    eyebrow: "THE ART OF SLOW LIVING",
    product: "The Sunday lounge chair",
    material: "Natural oak / Ivory bouclé",
    price: 420,
    palette: ["#e7dcc7", "#8c9377", "#343c2a"],
  },
  {
    id: "jewellery",
    name: "objects of gold.",
    industry: "Jewellery & accessories",
    mood: "Sculptural / intimate / timeless",
    description:
      "The product becomes the story. An intimate, editorial approach to everyday objects.",
    announcement: "Small objects. A lasting impression.",
    image: "/images/projects/project-01-placeholder.webp",
    smallImage: "/images/projects/project-01-small.webp",
    imageAlt: "Sculptural gold rings and earrings on warm travertine",
    headline: ["Ordinary days.", "Extraordinary gold."],
    detailHeadline: ["A closer look.", "A lasting detail."],
    storyHeadline: ["An everyday", "kind of extraordinary."],
    supporting: "Sculptural pieces with a quiet point of view.",
    story:
      "An illustrative exploration of form, light, and personal expression.",
    eyebrow: "OBJECTS TO KEEP CLOSE",
    product: "The sculpted gold hoops",
    material: "Polished gold finish / Demo design",
    price: 185,
    palette: ["#f5eee1", "#b88f46", "#523826"],
  },
  {
    id: "botanical",
    name: "rooted rituals.",
    industry: "Beauty & wellness",
    mood: "Botanical / grounded / expressive",
    description:
      "Ingredient-led storytelling, earthy contrast, and small rituals that feel personal.",
    announcement: "A return to the essentials.",
    image: "/images/projects/project-02-placeholder.webp",
    smallImage: "/images/projects/project-02-small.webp",
    imageAlt: "Amber skincare bottles against deep botanical green",
    headline: ["A little ritual.", "A deeper connection."],
    detailHeadline: ["Know your ritual.", "Meet the essentials."],
    storyHeadline: ["Rooted in nature.", "Made for your day."],
    supporting: "An everyday moment, thoughtfully considered.",
    story:
      "A visual concept for botanical, content-led commerce. Not a real skincare product.",
    eyebrow: "RETURN TO WHAT MATTERS",
    product: "The daily botanical serum",
    material: "Amber glass / 30 ml demo product",
    price: 38,
    palette: ["#e7e9d4", "#98a079", "#243629"],
  },
];
