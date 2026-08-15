export type GlossaryEntry = {
  slug: string;
  term: string;
  short: string;
  long: string;
  see?: string[];
};

export const glossary: GlossaryEntry[] = [
  {
    slug: "readymade",
    term: "Readymade",
    short: "An existing object taken from life and re-presented as art.",
    long: "Duchamp’s word for works like Fountain and Bicycle Wheel. The artistic act is selection, orientation, and naming — not craft in the old sense. The Hub first defined this in a modal on the Fountain page; it is still the most useful door into Dada and Conceptual Art.",
    see: ["fountain", "dadaism"],
  },
  {
    slug: "plein-air",
    term: "Plein air",
    short: "Painting outdoors, in the changing light.",
    long: "Impressionism’s laboratory. Portable paint in tubes made it practical; the ethic is that a motif is a moment, not a studio reconstruction.",
  },
  {
    slug: "divisionism",
    term: "Divisionism / Pointillism",
    short: "Color applied in separate dots so the eye mixes them.",
    long: "Seurat and Signac’s scientific hope: more luminosity if complementary colors sit side by side. Pointillism is the dotted technique; Divisionism is the broader optical theory.",
  },
  {
    slug: "automatism",
    term: "Automatism",
    short: "Drawing or writing with reason asked to wait outside.",
    long: "Surrealism’s core method, borrowed from psychology. Miró’s signs and Masson’s ink are cousins; Dalí’s ‘paranoiac-critical’ method is a more staged dialect of the same wish.",
  },
  {
    slug: "facture",
    term: "Facture / Faktura",
    short: "How the surface is made — the honesty of materials.",
    long: "In Constructivism, faktura is a virtue: show the metal, the photograph, the type. In painting more generally, facture is the visible life of the brush.",
  },
  {
    slug: "allover",
    term: "All-over",
    short: "A composition with no center, no privileged corner.",
    long: "Pollock’s drip paintings are the textbook case. Monet’s late Water Lilies already lean this way: a field you enter rather than a view you look into.",
  },
  {
    slug: "specific-object",
    term: "Specific object",
    short: "Judd’s word for work that is neither painting nor sculpture.",
    long: "A stack, a box, a progression: industrial materials, repeated units, real space. Minimalism’s grammar.",
  },
  {
    slug: "conceptual",
    term: "Concept as medium",
    short: "The idea is the work; the object is optional evidence.",
    long: "LeWitt’s sentence: the idea becomes a machine that makes the art. Kosuth, Weiner, Kawara practice different dialects of that claim.",
  },
  {
    slug: "modern-vs-contemporary",
    term: "Modern / contemporary",
    short: "Two clocks that overlap, and a word the Hub uses generously.",
    long: "Art historians often say modern for c. 1860–1960 and contemporary for living practice after that. Jerry’s original introduction uses contemporary for the whole adventure from late-19th-century Paris onward. The rebuilt Hub keeps that hospitality and adds later rooms so the name comes true.",
  },
  {
    slug: "series",
    term: "Series painting",
    short: "The same motif under different lights, as a system.",
    long: "Monet’s Haystacks, Cathedrals, Parliaments, Water Lilies. Time is the hidden subject. Use Two at Once to practice.",
  },
  {
    slug: "collage",
    term: "Collage / photomontage",
    short: "Real stuff — paper, photos, tickets — entering the picture.",
    long: "Cubism invents collage around 1912; Berlin Dada turns photomontage into politics (Höch); Pop will later shop in magazines again.",
  },
  {
    slug: "installation",
    term: "Installation",
    short: "A work you walk into.",
    long: "The room, the light, your path, and sometimes sound are part of the piece. Minimalism prepares this; after 1980 it becomes a default language of biennials.",
  },
];
