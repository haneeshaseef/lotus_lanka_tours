import { NextRequest, NextResponse } from "next/server";
import { getTourBySlug } from "@/lib/supabase/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const tour = await getTourBySlug(slug);
    if (!tour) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(tour);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 });
  }
}
