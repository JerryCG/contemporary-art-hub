import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const key = process.env.XAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "The looking companion needs XAI_API_KEY in .env.local." },
      { status: 501 },
    );
  }
  const { question, title, artist, movement, text } = (await req.json()) as {
    question?: string;
    title?: string;
    artist?: string;
    movement?: string;
    text?: string;
  };
  const client = new OpenAI({ apiKey: key, baseURL: "https://api.x.ai/v1" });
  try {
    const res = await client.responses.create({
      model: "grok-4.5",
      input: `You are a looking companion in JerryCG's Contemporary Art Hub. Help a visitor look, not cram facts. Be warm, precise, and short (120-180 words). Do not pretend to see details that are not in the provided text.

Work: ${title}
Artist: ${artist}
Movement: ${movement}
Hub text:
${text}

Visitor: ${question}`,
    });
    const out = (res as { output_text?: string }).output_text || "";
    return NextResponse.json({ text: out || "Look again, slower." });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ask failed" }, { status: 502 });
  }
}
