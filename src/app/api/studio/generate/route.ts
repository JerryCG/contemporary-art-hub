import { NextResponse } from "next/server";
import OpenAI from "openai";
import { wrapStudioPrompt } from "@/lib/studio-recipes";

export async function POST(req: Request) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Studio Imagine is asleep. Add XAI_API_KEY to .env.local, then try again. Local toys in Play still work." },
      { status: 501 },
    );
  }
  const { prompt, movement } = (await req.json()) as { prompt?: string; movement?: string };
  const client = new OpenAI({ apiKey: key, baseURL: "https://api.x.ai/v1" });
  try {
    const res = await client.images.generate({
      model: "grok-imagine-image-2.0",
      prompt: wrapStudioPrompt(prompt || "", movement || "impressionism"),
    });
    const url = res.data?.[0]?.url;
    if (!url) return NextResponse.json({ error: "No image returned." }, { status: 502 });
    return NextResponse.json({ url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Imagine failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
