"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function createGarage(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
    error: userErr
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { ok: false, error: "Ikke autentisert" };
  }

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim() || null;
  const size = (formData.get("size") as string | null)?.trim();
  const address = (formData.get("address") as string | null)?.trim();
  const startPrice = Number(formData.get("startPrice"));
  const bidEndAtRaw = (formData.get("bidEndAt") as string | null)?.trim();
  const imagesRaw = (formData.get("images") as string | null)?.trim();
  const images = imagesRaw
    ? imagesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!title || !size || !address || Number.isNaN(startPrice)) {
    return { ok: false, error: "Mangler påkrevde felt eller ugyldig pris" };
  }

  const { error } = await supabase.from("garages").insert({
    owner_id: user.id,
    title,
    description,
    size,
    address,
    start_price: startPrice,
    bid_end_at: bidEndAtRaw || undefined,
    images
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/sell/new");
  return { ok: true };
}

