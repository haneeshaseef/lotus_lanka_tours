import { NextResponse } from "next/server";
import { getAllMedia } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const media = await getAllMedia();
    return NextResponse.json(media);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
