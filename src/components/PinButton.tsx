"use client";

import { useEffect, useState } from "react";
import { isPinned, togglePin, type Pin } from "@/lib/journal";

export function PinButton(pin: Pin) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(isPinned(pin.kind, pin.slug)), [pin.kind, pin.slug]);
  return (
    <button
      type="button"
      onClick={() => setOn(togglePin(pin))}
      className="rounded-full border border-ink/20 px-4 py-1.5 text-[12px] uppercase tracking-[0.16em]"
    >
      {on ? "Pinned to journal" : "Pin to journal"}
    </button>
  );
}
