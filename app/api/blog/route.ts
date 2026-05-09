import { NextRequest, NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get("category") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");

  try {
    const result = await getPublishedBlogPosts({ category, page, limit });
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
