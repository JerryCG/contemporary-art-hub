export type Pin = { kind: "work" | "artist" | "movement"; slug: string; title: string };
export type Note = { id: string; body: string; at: number };
export type StudioSave = { id: string; prompt: string; movement: string; url: string; at: number };

const PINS = "cah.pins";
const NOTES = "cah.notes";
const STUDIO = "cah.studio";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function listPins(): Pin[] {
  return read<Pin[]>(PINS, []);
}
export function isPinned(kind: Pin["kind"], slug: string) {
  return listPins().some((p) => p.kind === kind && p.slug === slug);
}
export function togglePin(pin: Pin) {
  const cur = listPins();
  const exists = cur.some((p) => p.kind === pin.kind && p.slug === pin.slug);
  write(PINS, exists ? cur.filter((p) => !(p.kind === pin.kind && p.slug === pin.slug)) : [...cur, pin]);
  return !exists;
}
export function listNotes(): Note[] {
  return read<Note[]>(NOTES, []);
}
export function addNote(body: string) {
  const next = [{ id: crypto.randomUUID(), body, at: Date.now() }, ...listNotes()];
  write(NOTES, next);
  return next;
}
export function listStudio(): StudioSave[] {
  return read<StudioSave[]>(STUDIO, []);
}
export function addStudio(save: Omit<StudioSave, "id" | "at">) {
  const next = [{ ...save, id: crypto.randomUUID(), at: Date.now() }, ...listStudio()];
  write(STUDIO, next);
  return next;
}
