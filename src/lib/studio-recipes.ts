export const studioRecipes: Record<string, { label: string; recipe: string }> = {
  impressionism: {
    label: "Impressionist light",
    recipe:
      "Paint this as a late-19th-century Impressionist outdoor study: broken complementary color, visible short brush dabs, violet and blue shadows, no brown bitumen, fleeting weather, ordinary modern life, luminous air.",
  },
  "neo-impressionism": {
    label: "Divisionist dots",
    recipe:
      "Compose with distinct pointillist dots of pure color that optically mix at a distance, calm monumental figures, scientific luminosity, Seurat-like stillness without copying a specific canvas.",
  },
  "post-impressionism": {
    label: "After the impression",
    recipe:
      "Intensify contour and local color, swirling charged line, emotional weather, structured planes like constructed apples or a night sky that thinks, not a postcard.",
  },
  fauvism: {
    label: "Wild color",
    recipe:
      "Unmixed slabs of loud color independent of local description, red trees or orange water allowed, decorative flatness, joy and shock in the same surface.",
  },
  expressionism: {
    label: "Inner weather",
    recipe:
      "Distort for feeling: tilted space, raw contour, acid or blood color, a psychological climate more honest than likeness.",
  },
  cubism: {
    label: "Several sides at once",
    recipe:
      "Analyze the subject into overlapping facets and multiple viewpoints, ochres and grays or later flatter collage planes, no single perspective throne.",
  },
  futurism: {
    label: "Force-lines",
    recipe:
      "Depict speed itself: repeating limbs, force-lines, diagonals, the city or machine as velocity, staccato rhythm.",
  },
  dadaism: {
    label: "Chance and cut",
    recipe:
      "A Dada collage or readymade scene: torn paper, rubber stamps, absurd juxtaposition, anti-precious, chance alignment, dark humor.",
  },
  surrealism: {
    label: "Lucid dream",
    recipe:
      "A lucid, precisely painted impossibility: deadpan lighting, long shadows, melted or doubled objects, the familiar made slightly wrong, not random weirdness.",
  },
  suprematism: {
    label: "Zero of form",
    recipe:
      "Non-objective floating planes on white: squares, rectangles, a cross, primary and black, no objects, feeling as geometry.",
  },
  constructivism: {
    label: "Constructed diagonal",
    recipe:
      "Photomontage and ruler geometry, red and black, dynamic diagonal, industrial type, art as construction not window.",
  },
  primitivism: {
    label: "Dreamed jungle",
    recipe:
      "A self-taught, frontal, densely leafed dream landscape, sincere and slightly uncanny, not a parody of any culture’s sacred art.",
  },
  minimalism: {
    label: "One interval",
    recipe:
      "Severe reduction: a few industrial volumes or a pale hand-drawn grid, real space, almost no composition gossip, quiet attention.",
  },
  symbolism: {
    label: "Emblem and gold",
    recipe:
      "Mythic, interior, jeweled or moonlit, emblem rather than anecdote, closed eyelids, gold pattern, a password not a storyboard.",
  },
  purism: {
    label: "Clean volumes",
    recipe:
      "Purist still life after Cubism: standard bottles and guitars as architecture, cool light, no shattered debris, machine calm.",
  },
  "abstract-art": {
    label: "Inner necessity",
    recipe:
      "Non-representational color-music: hovering forms, synesthetic chords, a line taking a walk, no obligatory objects.",
  },
  "de-stijl": {
    label: "Primary balance",
    recipe:
      "Horizontal and vertical only, primaries plus black white gray, carefully tensed balance, no diagonal unless the visitor asks for a heresy.",
  },
  "abstract-expressionism": {
    label: "Arena or field",
    recipe:
      "Either an all-over record of a moving body with enamel drips, or a mural-scale field of hovering color rectangles. No cute figures.",
  },
  "pop-art": {
    label: "Ben-Day everyday",
    recipe:
      "Flat commercial color, Ben-Day or screenprint look, supermarket or comic or celebrity as nature, deadpan repetition, not a luxury oil sketch.",
  },
  "conceptual-art": {
    label: "The sentence",
    recipe:
      "A spare conceptual proposition: typography on a wall, a dated canvas, a chair beside its definition. The idea is visible. No decorative surplus.",
  },
  "after-1980": {
    label: "After the last manifesto",
    recipe:
      "A contemporary installation or screen-age image: site, body, or broadcast as material, lucid and specific, not a pastiche of a famous living artist.",
  },
};

export function wrapStudioPrompt(user: string, movement: string) {
  const rec = studioRecipes[movement];
  const body = user.trim() || "an ordinary everyday scene";
  const style = rec?.recipe ?? "a thoughtful contemporary art study";
  return `${body}. ${style} Original artwork in the language of a movement, not a forgery of a named living or in-copyright artist. No artist signature. Fine-art photograph of a finished work on a plaster gallery wall.`;
}
