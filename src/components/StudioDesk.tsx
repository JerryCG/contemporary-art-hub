"use client";

import { useState } from "react";
import { addStudio } from "@/lib/journal";

export function StudioDesk({ movements }: { movements: { slug: string; title: string }[] }) {
  const [mode, setMode] = useState<"words" | "photo">("words");
  const [movement, setMovement] = useState("impressionism");
  const [prompt, setPrompt] = useState("a rainy tram stop at dusk");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run() {
    setBusy(true);
    setErr("");
    try {
      if (mode === "words") {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/studio/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, movement }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        setUrl(data.url);
        addStudio({ prompt, movement, url: data.url });
      } else {
        if (!file) throw new Error("Choose a photo first.");
        const imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Could not read the photo"));
          reader.readAsDataURL(file);
        });
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/studio/transfer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, movement, imageBase64, mime: file.type }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Transfer failed");
        setUrl(data.url);
        addStudio({ prompt: `photo → ${prompt}`, movement, url: data.url });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10">
      <div className="flex gap-2">
        {(["words", "photo"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-[12px] uppercase tracking-[0.16em] ${mode === m ? "bg-ink text-paper" : "border border-ink/15"}`}
          >
            {m === "words" ? "From words" : "From a photo"}
          </button>
        ))}
      </div>
      <label className="mt-6 block text-sm text-ink/60">Room</label>
      <select value={movement} onChange={(e) => setMovement(e.target.value)} className="mt-1 w-full border border-ink/15 bg-paper px-3 py-2">
        {movements.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.title}
          </option>
        ))}
      </select>
      <label className="mt-4 block text-sm text-ink/60">What should appear</label>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-1 min-h-24 w-full border border-ink/15 bg-paper-raised p-3" />
      {mode === "photo" && (
        <input type="file" accept="image/*" className="mt-4" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      )}
      <button type="button" onClick={run} disabled={busy} className="mt-6 rounded-full bg-ink px-6 py-2 text-paper disabled:opacity-50">
        {busy ? "In the studio…" : "Make it"}
      </button>
      {err && <p className="mt-4 text-sm text-ink/70">{err}</p>}
      {url && <img src={url} alt="Studio result" className="frame mt-8 w-full" />}
      <p className="mt-6 text-xs text-ink/45">
        This is play, not a forgery studio. Outputs are new pictures in a movement’s language. Add XAI_API_KEY to .env.local to
        enable Imagine.
      </p>
    </div>
  );
}
