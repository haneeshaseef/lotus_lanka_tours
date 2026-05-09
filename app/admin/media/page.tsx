import { createAdminClient } from "@/lib/supabase/server";
import MediaLibrary from "./MediaLibrary";

export default async function AdminMediaPage() {
  const supabase = await createAdminClient();
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .order("uploaded_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Media Library</h2>
        <p className="text-sm text-gray-500">{media?.length ?? 0} files</p>
      </div>
      <MediaLibrary initialMedia={media ?? []} />
    </div>
  );
}
