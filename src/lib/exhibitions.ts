export type Show = {
  title: string;
  venue: string;
  city: string;
  region: "hong-kong" | "asia" | "world" | "online";
  dates: string;
  why: string;
  href: string;
};

/** Curated, always-on calendar. Live APIs (when available) layer on top. */
export const curatedShows: Show[] = [
  {
    title: "Collection displays & special exhibitions",
    venue: "M+",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "Ongoing — check current hang",
    why: "The city’s museum of visual culture; the right next step after Jerry’s Tai Kwun notes.",
    href: "https://www.mplus.org.hk/en/exhibitions/",
  },
  {
    title: "Contemporary exhibitions in the former Central Police Station",
    venue: "Tai Kwun Contemporary",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "Rotating",
    why: "The yard and the prison rooms are part of the work. Read the atelier essay first, then go.",
    href: "https://www.taikwun.hk/en/programme/index/art",
  },
  {
    title: "Art Basel Hong Kong",
    venue: "Hong Kong Convention and Exhibition Centre",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "Annually each spring",
    why: "Jerry wrote the 2019 edition into the Hub. The fair is still the region’s loudest week of looking.",
    href: "https://www.artbasel.com/hong-kong",
  },
  {
    title: "Para Site",
    venue: "Para Site",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "Rotating",
    why: "Independent, argumentative, often the most interesting room in town.",
    href: "https://www.para-site.art/",
  },
  {
    title: "CHAT (Centre for Heritage, Arts and Textile)",
    venue: "The Mills",
    city: "Hong Kong",
    region: "hong-kong",
    dates: "Rotating",
    why: "Textiles, labor, and contemporary practice in a former cotton mill — a Constructivist’s kind of building.",
    href: "https://www.mill6chat.org/",
  },
  {
    title: "National Museum of Modern Art",
    venue: "MOMAT",
    city: "Tokyo",
    region: "asia",
    dates: "Collection + specials",
    why: "A Pacific twin to the Hub’s modern story.",
    href: "https://www.momat.go.jp/en",
  },
  {
    title: "National Gallery Singapore",
    venue: "National Gallery Singapore",
    city: "Singapore",
    region: "asia",
    dates: "Ongoing",
    why: "Southeast Asian modernisms the Paris-centered rooms cannot cover alone.",
    href: "https://www.nationalgallery.sg/",
  },
  {
    title: "Collection 1880s–1950s / 1970s–Present",
    venue: "MoMA",
    city: "New York",
    region: "world",
    dates: "Ongoing hang",
    why: "The textbook spine: Starry Night, Demoiselles, the drip, the soup can — in the flesh when you can.",
    href: "https://www.moma.org/calendar/exhibitions",
  },
  {
    title: "Tate Modern collection and Turbine Hall",
    venue: "Tate Modern",
    city: "London",
    region: "world",
    dates: "Ongoing",
    why: "A walk from Cubism to installation at civic scale.",
    href: "https://www.tate.org.uk/visit/tate-modern",
  },
  {
    title: "Musée national d’art moderne",
    venue: "Centre Pompidou",
    city: "Paris",
    region: "world",
    dates: "Ongoing (check venue during renovations)",
    why: "Paris remains the capital of the first half of this Hub.",
    href: "https://www.centrepompidou.fr/",
  },
  {
    title: "Musée d’Orsay — Impressionism to 1914",
    venue: "Musée d’Orsay",
    city: "Paris",
    region: "world",
    dates: "Ongoing",
    why: "Manet, Monet, the Grande Jatte, Cézanne — the first rooms of the Hub in one building.",
    href: "https://www.musee-orsay.fr/",
  },
  {
    title: "Google Arts & Culture — online hang",
    venue: "Google Arts & Culture",
    city: "Online",
    region: "online",
    dates: "Always open",
    why: "When the city is far, zoom is a form of travel.",
    href: "https://artsandculture.google.com/",
  },
];
