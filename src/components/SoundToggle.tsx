"use client";

import { useEffect, useRef, useState } from "react";

export function SoundToggle() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    audio.current = new Audio(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/audio/hall-bgm.mp3`);
    audio.current.loop = true;
    audio.current.volume = 0.28;
    return () => {
      audio.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!audio.current) return;
    if (on) audio.current.play().catch(() => setOn(false));
    else audio.current.pause();
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="rounded-full border border-ink/15 px-3 py-1 text-[12px] text-ink/60"
      aria-pressed={on}
    >
      {on ? "Sound on" : "Sound"}
    </button>
  );
}
