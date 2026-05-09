import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
  sendCustomTourConfirmation,
  sendAdminCustomTourNotification,
} from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, destinations, duration_days, travel_date, guests, interests, budget_lkr, special_requests } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("custom_tour_requests").insert({
      name,
      email,
      phone: phone || null,
      destinations: destinations || [],
      duration_days: duration_days || null,
      travel_date: travel_date || null,
      guests: guests || 1,
      interests: interests || [],
      budget_lkr: budget_lkr || null,
      special_requests: special_requests || null,
      status: "new",
    });

    if (error) throw error;

    Promise.allSettled([
      sendCustomTourConfirmation({ name, email, destinations: destinations || [], duration: duration_days }),
      sendAdminCustomTourNotification({ name, email, phone, destinations: destinations || [], duration: duration_days, travelDate: travel_date, guests: guests || 1, interests, specialRequests: special_requests }),
    ]).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Custom tour POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
