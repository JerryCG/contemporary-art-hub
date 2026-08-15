import { NextResponse } from "next/server";
import { wrapStudioPrompt } from "@/lib/studio-recipes";

export async function POST(req: Request) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Style transfer needs XAI_API_KEY in .env.local. Meanwhile try Shatter or Xerox in Play." },
      { status: 501 },
    );
  }
  const { prompt, movement, imageBase64 } = (await req.json()) as {
    prompt?: string;
    movement?: string;
    imageBase64?: string;
  };
  if (!imageBase64) return NextResponse.json({ error: "Missing photo." }, { status: 400 });

  try {
    const res = await fetch("https://api.x.ai/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "grok-imagine-image-2.0",
        prompt: wrapStudioPrompt(prompt || "restyle this photograph", movement || "impressionism"),
        image: { url: imageBase64, type: "image_url" },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || data.error || "Edit failed" }, { status: 502 });
    }
    const url = data.data?.[0]?.url || data.url;
    if (!url) return NextResponse.json({ error: "No image returned." }, { status: 502 });
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Edit failed" }, { status: 502 });
  }
}
