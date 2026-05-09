import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 });

  const supabase = createAdminClient();
  const uploaded = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filename, buffer, { contentType: file.type, upsert: false });

    if (uploadError) continue;

    const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(filename);

    const { data: mediaRow } = await supabase
      .from("media")
      .insert({
        filename: file.name,
        url: publicUrl,
        bucket: "media",
        size_bytes: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (mediaRow) uploaded.push(mediaRow);
  }

  return NextResponse.json({ uploaded }, { status: 201 });
}
