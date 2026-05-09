import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TourForm from "../../TourForm";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const { data: tour } = await supabase.from("tours").select("*").eq("id", id).single();
  if (!tour) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Tour</h2>
      <TourForm tour={tour} />
    </div>
  );
}
