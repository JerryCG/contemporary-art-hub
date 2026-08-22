"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaikwunRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/atelier/appreciation#taikwun");
  }, [router]);
  return <p className="page text-ink/60">Opening Art Appreciation…</p>;
}
