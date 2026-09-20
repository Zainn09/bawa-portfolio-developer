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
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value + "T12:00:00Z"));
