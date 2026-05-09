import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/validations";
import {
  sendInquiryConfirmation,
  sendAdminInquiryNotification,
} from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    const { error } = await supabase.from("inquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      tour_id: data.tour_id ?? null,
      tour_name_text: data.tour_name_text ?? null,
      travel_date: data.travel_date ?? null,
      guests: data.guests ?? 1,
      message: data.message ?? null,
      locale: data.locale ?? "en",
      status: "new",
    });

    if (error) throw error;

    const tourName = data.tour_name_text ?? "a tour";

    // Fire-and-forget emails
    Promise.allSettled([
      sendInquiryConfirmation({ name: data.name, email: data.email, tourName }),
      sendAdminInquiryNotification({
        name: data.name,
        email: data.email,
        phone: data.phone,
        tourName,
        travelDate: data.travel_date,
        guests: data.guests ?? 1,
        message: data.message,
      }),
    ]).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Inquiry POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
