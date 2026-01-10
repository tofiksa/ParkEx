"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function upsertProfile(formData: FormData) {
	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		return { ok: false, error: "Supabase ikke konfigurert" };
	}

	// Get authenticated user from cookies (managed by middleware)
	const {
		data: { user },
		error: userErr,
	} = await supabase.auth.getUser();

	if (userErr || !user) {
		return { ok: false, error: "Ikke autentisert. Prøv å oppdatere siden og logg inn på nytt." };
	}

	const firstName = (formData.get("firstName") as string | null)?.trim();
	const lastName = (formData.get("lastName") as string | null)?.trim();
	const email = (formData.get("email") as string | null)?.trim();
	const role = formData.get("role") as "buyer" | "seller" | null;
	const phone = (formData.get("phone") as string | null)?.trim() || null;
	const address = (formData.get("address") as string | null)?.trim() || null;

	if (!firstName || !lastName || !email || !role) {
		return { ok: false, error: "Mangler påkrevde felt" };
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
			address,
		});

	if (error) {
		console.error("Error upserting profile:", error);
		return { ok: false, error: error.message };
	}

	revalidatePath("/");
	revalidatePath("/profile");
	return { ok: true };
}
