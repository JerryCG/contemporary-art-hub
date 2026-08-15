export type LearnStep = { href: string; title: string; why: string };

export const paths = {
  beginner: {
    slug: "beginner",
    title: "First visit",
    duration: "about 45 minutes",
    lede: "A first walk if you are new here.",
    steps: [
      { href: "/", title: "Home", why: "Start with a few famous pictures." },
      { href: "/introduction", title: "Introduction", why: "What this site covers." },
      { href: "/rooms/impressionism", title: "Impressionism", why: "Light and everyday scenes." },
      { href: "/works/impression-sunrise", title: "Impression, Sunrise", why: "The painting that named a movement." },
      { href: "/rooms/cubism", title: "Cubism", why: "An object seen from many sides." },
      { href: "/works/fountain", title: "Fountain", why: "When an everyday object became art." },
      { href: "/atelier", title: "Atelier", why: "Jerry’s own works and notes." },
    ] satisfies LearnStep[],
  },
  intermediate: {
    slug: "intermediate",
    title: "Student",
    duration: "a long afternoon",
    lede: "Compare works and go a little deeper.",
    steps: [
      { href: "/play/compare", title: "Compare", why: "Two pictures at once." },
      { href: "/works/haystacks-series", title: "Haystacks", why: "The same motif in different light." },
      { href: "/rooms/post-impressionism", title: "Post-impressionism", why: "Why Cézanne matters to what came next." },
      { href: "/works/guernica", title: "Guernica", why: "Cubism and history." },
      { href: "/rooms/surrealism", title: "Surrealism", why: "Dreams as a way of making art." },
      { href: "/play/quiz", title: "Quiz", why: "Check what you remember." },
      { href: "/now", title: "Now showing", why: "Exhibitions you can visit." },
    ] satisfies LearnStep[],
  },
  advanced: {
    slug: "advanced",
    title: "Scholar",
    duration: "repeatable",
    lede: "Later movements and original texts.",
    steps: [
      { href: "/timeline", title: "Timeline", why: "See the century in order." },
      { href: "/rooms/dadaism", title: "Dada", why: "When artists refused the old rules." },
      { href: "/docs/manifesto-of-futurism.pdf", title: "Futurist manifesto (PDF)", why: "A key text of the avant-garde." },
      { href: "/rooms/conceptual-art", title: "Conceptual Art", why: "When the idea became the work." },
      { href: "/rooms/abstract-expressionism", title: "Abstract Expressionism", why: "Large paintings made as an event." },
      { href: "/rooms/after-1980", title: "After 1980", why: "Performance, land art, and the screen." },
      { href: "/journal", title: "Journal", why: "Keep your own notes." },
    ] satisfies LearnStep[],
  },
};

export const outbound = [
  {
    group: "Look longer",
    links: [
      { name: "Google Arts & Culture", href: "https://artsandculture.google.com/", note: "Walk museums from a desk; zoom into brushwork." },
      { name: "Smarthistory", href: "https://smarthistory.org/", note: "The best free essays on individual works." },
      { name: "Khan Academy · Art history", href: "https://www.khanacademy.org/humanities/art-history", note: "Clear courses if you want a syllabus." },
    ],
  },
  {
    group: "Museum classrooms",
    links: [
      { name: "MoMA Learning", href: "https://www.moma.org/learn/", note: "Especially strong on 1880–now." },
      { name: "Tate", href: "https://www.tate.org.uk/art", note: "Glossaries, artist pages, British and international collections." },
      { name: "The Met · Heilbrunn Timeline", href: "https://www.metmuseum.org/toah/", note: "A reliable spine of world art history." },
      { name: "Centre Pompidou", href: "https://www.centrepompidou.fr/", note: "Paris, still a capital of the story this Hub tells." },
    ],
  },
  {
    group: "Hong Kong and nearby",
    links: [
      { name: "M+", href: "https://www.mplus.org.hk/", note: "Visual culture in the city Jerry already wrote from." },
      { name: "Tai Kwun", href: "https://www.taikwun.hk/", note: "The prison-yard exhibitions in the atelier essay." },
      { name: "Para Site", href: "https://www.para-site.art/", note: "Independent, sharp, contemporary." },
    ],
  },
  {
    group: "Advanced and archival",
    links: [
      { name: "UbuWeb", href: "https://ubu.com/", note: "Avant-garde film, sound, and text. Unruly on purpose." },
      { name: "e-flux", href: "https://www.e-flux.com/", note: "Essays from the living contemporary." },
      { name: "Artforum", href: "https://www.artforum.com/", note: "Criticism as a weather report." },
      { name: "Wikimedia Commons", href: "https://commons.wikimedia.org/", note: "Public-domain images, including many works in this Hub." },
    ],
  },
];
