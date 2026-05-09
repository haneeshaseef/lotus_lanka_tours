import { NextRequest, NextResponse } from "next/server";
import { getPublishedTours } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const duration = searchParams.get("duration") ? parseInt(searchParams.get("duration")!) : undefined;
  const search = searchParams.get("search") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  try {
    const result = await getPublishedTours({ category, duration, search, page, limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}
