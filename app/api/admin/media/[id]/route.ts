import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: media } = await supabase.from("media").select("filename, bucket").eq("id", id).single();
  if (media) {
    await supabase.storage.from(media.bucket).remove([media.filename]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
