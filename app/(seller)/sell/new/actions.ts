"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function createGarage(formData: FormData) {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		return { ok: false, error: "Supabase ikke konfigurert" };
	}
	
	const {
		data: { user },
		error: userErr,
	} = await supabase.auth.getUser();
	if (userErr || !user) {
		return { ok: false, error: "Ikke autentisert" };
	}

	// Check if user has a completed profile with seller role
	const { data: profile, error: profileErr } = await supabase
		.from("profiles")
		.select("id, role")
		.eq("id", user.id)
		.maybeSingle();
	
	if (profileErr) {
		console.error("Error fetching profile:", profileErr);
		return { ok: false, error: "Kunne ikke hente profil" };
	}
	
	if (!profile) {
		return { ok: false, error: "Du må fullføre profilen din før du kan opprette annonser. Gå til /profile." };
	}
	
	if (profile.role !== "seller") {
		return { ok: false, error: "Kun selgere kan opprette annonser. Endre rollen din i profilen." };
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

	if (!title || !size || !address || Number.isNaN(startPrice) || startPrice <= 0) {
		return { ok: false, error: "Mangler påkrevde felt eller ugyldig pris" };
	}

	const { data: garage, error } = await supabase
		.from("garages")
		.insert({
			owner_id: user.id,
			title,
			description,
			size,
			address,
			start_price: startPrice,
			bid_end_at: bidEndAtRaw || undefined,
			images,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating garage:", error);
		return { ok: false, error: error.message };
	}

	revalidatePath("/listings");
	revalidatePath("/sell/new");
	
	// Redirect to the new listing
	redirect(`/listings/${garage.id}`);
}
