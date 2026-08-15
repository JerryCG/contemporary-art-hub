export type Movement = {
  slug: string;
  title: string;
  years: string;
  place: string;
  order: number;
  accent: string;
  origin: boolean;
  heroImage: string | null;
  paragraphs: string[];
  deeper?: string[];
  theory?: string[];
  looking?: string[];
  artistSlugs: string[];
  slideshow: string[];
  originalPath?: string;
  playHint?: { href: string; label: string };
};

export type Artist = {
  slug: string;
  name: string;
  nationality: string;
  life: string;
  movement: string;
  portrait: string | null;
  paragraphs: string[];
  workSlugs: string[];
  origin: boolean;
  originalPath?: string;
};

export type Work = {
  slug: string;
  title: string;
  artist: string;
  movement: string;
  subtitle: string;
  kind: "work" | "series" | "collection";
  image: string | null;
  images: string[];
  paragraphs: string[];
  featured: number | null;
  origin: boolean;
  year?: string;
  credit?: string;
  license?: string;
  originalPath?: string;
};

export type QuizQuestion = {
  prompt: string;
  options: { value: string; label: string }[];
  image?: string | null;
  audio?: string | null;
  answer?: string;
};

export type Catalog = {
  movements: Movement[];
  artists: Artist[];
  works: Work[];
  introduction: { title: string; paragraphs: string[]; timelineImage?: string };
  quiz: { title: string; questions: QuizQuestion[] };
  atelier: {
    xerox: { paragraphs: string[]; images: string[] };
    soundMap: { image: string | null };
    atlas: { paragraphs: string[]; beginning: string; ending: string };
    taikwun: { paragraphs: string[]; images: string[] };
    fieldPhotos: string[];
  };
};
