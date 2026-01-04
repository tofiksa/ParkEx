"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function upsertProfile(formData: FormData) {
  const supabase = getSupabaseServerClient();
  const firstName = (formData.get("firstName") as string | null)?.trim();
  const lastName = (formData.get("lastName") as string | null)?.trim();
  const email = (formData.get("email") as string | null)?.trim();
  const role = formData.get("role") as "buyer" | "seller" | null;
  const phone = (formData.get("phone") as string | null)?.trim() || null;
  const address = (formData.get("address") as string | null)?.trim() || null;

  if (!firstName || !lastName || !email || !role) {
    return { ok: false, error: "Mangler påkrevde felt" };
  }

  const {
    data: { user },
    error: userErr
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { ok: false, error: "Ikke autentisert" };
  }

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      role,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address
    })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  return { ok: true };
}

