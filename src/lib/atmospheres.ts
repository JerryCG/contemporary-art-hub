export type Atmosphere = {
  className: string;
  grain: string;
  frame: string;
  label: string;
};

export const atmospheres: Record<string, Atmosphere> = {
  impressionism: {
    className: "atm-impressionism",
    grain: "Dappled light",
    frame: "broken-color",
    label: "A sunlight revolution on the canvas",
  },
  "neo-impressionism": {
    className: "atm-neo",
    grain: "Optical mix",
    frame: "points",
    label: "Color mixed in the eye, not on the palette",
  },
  "post-impressionism": {
    className: "atm-post",
    grain: "Charged contour",
    frame: "swirl",
    label: "Feeling after the impression",
  },
  symbolism: {
    className: "atm-symbolism",
    grain: "Dream varnish",
    frame: "myth",
    label: "The inner world before Surrealism",
  },
  fauvism: {
    className: "atm-fauvism",
    grain: "Wild beasts",
    frame: "slab",
    label: "Color set free of description",
  },
  expressionism: {
    className: "atm-expressionism",
    grain: "Raw tilt",
    frame: "stroke",
    label: "The scream under the skin",
  },
  cubism: {
    className: "atm-cubism",
    grain: "Many viewpoints",
    frame: "facet",
    label: "An object seen from everywhere at once",
  },
  futurism: {
    className: "atm-futurism",
    grain: "Speed lines",
    frame: "diagonal",
    label: "The world as velocity",
  },
  primitivism: {
    className: "atm-primitivism",
    grain: "Jungle density",
    frame: "naive",
    label: "A dreamed elsewhere",
  },
  suprematism: {
    className: "atm-suprematism",
    grain: "Floating plane",
    frame: "square",
    label: "Feeling, without objects",
  },
  constructivism: {
    className: "atm-constructivism",
    grain: "Ruler and red",
    frame: "montage",
    label: "Art into life, into the street",
  },
  dadaism: {
    className: "atm-dada",
    grain: "Chance tear",
    frame: "stamp",
    label: "Anti-art as the most serious joke",
  },
  purism: {
    className: "atm-purism",
    grain: "Machine calm",
    frame: "cylinder",
    label: "After Cubism, a cleaner order",
  },
  surrealism: {
    className: "atm-surrealism",
    grain: "Impossible shadow",
    frame: "melt",
    label: "The real functioning of thought",
  },
  "abstract-art": {
    className: "atm-abstract",
    grain: "Inner necessity",
    frame: "field",
    label: "When painting leaves the thing behind",
  },
  "de-stijl": {
    className: "atm-destijl",
    grain: "Primary grid",
    frame: "grid",
    label: "Horizontal, vertical, three colors",
  },
  "abstract-expressionism": {
    className: "atm-abex",
    grain: "Action field",
    frame: "drip",
    label: "The canvas as an arena",
  },
  "pop-art": {
    className: "atm-pop",
    grain: "Ben-Day",
    frame: "comic",
    label: "The supermarket as chapel",
  },
  minimalism: {
    className: "atm-minimalism",
    grain: "One interval",
    frame: "box",
    label: "What you see is what you see",
  },
  "conceptual-art": {
    className: "atm-conceptual",
    grain: "The sentence",
    frame: "text",
    label: "The idea becomes a machine that makes the art",
  },
  "after-1980": {
    className: "atm-after",
    grain: "Many nows",
    frame: "screen",
    label: "After the last manifesto",
  },
};

export function atmosphereFor(slug: string): Atmosphere {
  return (
    atmospheres[slug] ?? {
      className: "atm-default",
      grain: "Plaster",
      frame: "frame",
      label: "A room in the Hub",
    }
  );
}
