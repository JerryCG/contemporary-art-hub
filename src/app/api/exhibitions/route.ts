import { NextResponse } from "next/server";
import { curatedShows } from "@/lib/exhibitions";

export async function GET() {
  return NextResponse.json({ source: "Curated Hub calendar", shows: curatedShows }, {
    headers: { "Cache-Control": "s-maxage=43200, stale-while-revalidate=86400" },
  });
}
