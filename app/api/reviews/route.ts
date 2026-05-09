import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tour_id, reviewer_name, reviewer_country, rating, comment } = body;

    if (!tour_id || !reviewer_name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").insert({
      tour_id,
      reviewer_name,
      reviewer_country: reviewer_country || null,
      rating,
      comment: comment || null,
      is_approved: false,
    });

    if (error) throw error;
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Review POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
