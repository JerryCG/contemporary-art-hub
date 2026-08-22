"use client";

import { useEffect } from "react";
import { withBase } from "@/lib/base";

export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const src = withBase("/sw.js");
    const scope = withBase("/") || "/";
    navigator.serviceWorker.register(src, { scope }).catch(() => {});
  }, []);
  return null;
}
