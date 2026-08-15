export type LearnStep = { href: string; title: string; why: string };

export const paths = {
  beginner: {
    slug: "beginner",
    title: "First visit",
    duration: "about 45 minutes",
    lede: "A walk through the Hub if you have never stood in front of these pictures on purpose.",
    steps: [
      { href: "/", title: "Stand in the Hall", why: "Six doors, six temperatures. Notice which picture pulls you." },
      { href: "/introduction", title: "How this house is built", why: "Jerry’s original welcome, plus the modern/contemporary note." },
      { href: "/rooms/impressionism", title: "Impressionism", why: "Light before story. The sunlight revolution." },
      { href: "/works/impression-sunrise", title: "Impression, Sunrise", why: "The painting that accidentally named a movement." },
      { href: "/rooms/cubism", title: "Cubism", why: "An object from several sides. The century’s grammar lesson." },
      { href: "/works/fountain", title: "Fountain", why: "The joke that rewrote the rules. Read the word readymade." },
      { href: "/atelier", title: "Jerry’s atelier", why: "Xerox, a sound map, Tai Kwun. The Hub is also a memory." },
    ] satisfies LearnStep[],
  },
  intermediate: {
    slug: "intermediate",
    title: "Student",
    duration: "a long afternoon",
    lede: "Comparisons, series, and the first theory floor.",
    steps: [
      { href: "/play/compare", title: "Two at Once", why: "Monet’s series logic in your hands." },
      { href: "/works/haystacks-series", title: "Haystacks", why: "Same stacks, different hours." },
      { href: "/rooms/post-impressionism", title: "Post-impressionism · Theory", why: "Why Cézanne is the hinge." },
      { href: "/works/guernica", title: "Guernica", why: "Cubism taken to history." },
      { href: "/rooms/surrealism", title: "Surrealism", why: "Dream as method, not costume." },
      { href: "/play/quiz", title: "Quiz Theater · original set", why: "Jerry’s ten questions, Doge answers included." },
      { href: "/now", title: "Now showing", why: "Take looking back into the city." },
    ] satisfies LearnStep[],
  },
  advanced: {
    slug: "advanced",
    title: "Scholar",
    duration: "repeatable",
    lede: "Manifestos, influence, and the later rooms that make the name contemporary true.",
    steps: [
      { href: "/timeline", title: "The corridor of time", why: "Walk the century instead of memorizing dates." },
      { href: "/rooms/dadaism", title: "Dada · Theory", why: "Anti-art still needs a public." },
      { href: "/docs/manifesto-of-futurism.pdf", title: "Futurist manifesto (PDF)", why: "Read a shout that wanted to be a world." },
      { href: "/rooms/conceptual-art", title: "Conceptual Art", why: "The empty homepage stub, finally a room." },
      { href: "/rooms/abstract-expressionism", title: "Abstract Expressionism", why: "The canvas as arena." },
      { href: "/rooms/after-1980", title: "After 1980", why: "Performance, land, street, screen — doors, not fake depth." },
      { href: "/journal", title: "Write on the wall", why: "A scholar without notes is only a tourist." },
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
