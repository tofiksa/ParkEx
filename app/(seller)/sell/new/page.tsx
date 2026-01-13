"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { createGarage } from "./actions";

type Profile = {
	role?: "buyer" | "seller";
};

export default function NewListingPage() {
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!supabase) {
			setIsAuthenticated(false);
			setLoading(false);
			return;
		}

		const checkAuth = async () => {
			const {
				data: { user },
				error: userErr,
			} = await supabase.auth.getUser();

			if (userErr || !user) {
				setIsAuthenticated(false);
				setLoading(false);
				router.push("/login?redirect=/sell/new");
				return;
			}

			setIsAuthenticated(true);

			// Fetch profile to check role
			const { data: profileData } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", user.id)
				.maybeSingle();

			setProfile(profileData);
			setLoading(false);
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (!session?.user) {
				setIsAuthenticated(false);
				// If user signed out intentionally, redirect to home
				// Otherwise (session expired), redirect to login
				if (event === "SIGNED_OUT") {
					router.push("/");
				} else {
					router.push("/login?redirect=/sell/new");
				}
			} else {
				setIsAuthenticated(true);
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, router]);

	// Handle form submission with error display
	const handleSubmit = async (formData: FormData) => {
		setError(null);
		setSubmitting(true);

		try {
			const result = await createGarage(formData);
			// If we get here without redirect, there was an error
			if (result && !result.ok) {
				setError(result.error || "Noe gikk galt");
			}
		} catch (err) {
			// Redirect throws an error in Next.js, which is expected behavior
			// Only show error if it's not a redirect
			if (err instanceof Error && !err.message.includes("NEXT_REDIRECT")) {
				setError("En uventet feil oppstod");
				console.error("Form submission error:", err);
			}
		} finally {
			setSubmitting(false);
		}
	};

	if (!supabase) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<p className="text-sm text-red-400">
					Mangler Supabase konfig (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
				</p>
			</main>
		);
	}

	if (loading || isAuthenticated === null) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="text-sm text-muted-foreground">Sjekker autentisering...</div>
			</main>
		);
	}

	if (isAuthenticated === false) {
		return null; // Redirect is happening
	}

	// Check if profile is incomplete or not a seller
	if (!profile) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur text-center">
					<p className="text-lg font-semibold text-foreground mb-2">Profil ikke fullført</p>
					<p className="text-sm text-muted-foreground mb-4">
						Du må fullføre profilen din og velge rollen "Selger" før du kan opprette annonser.
					</p>
					<Link
						href="/profile"
						className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
					>
						Gå til profil
					</Link>
				</div>
			</main>
		);
	}

	if (profile.role !== "seller") {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur text-center">
					<p className="text-lg font-semibold text-foreground mb-2">Kun for selgere</p>
					<p className="text-sm text-muted-foreground mb-4">
						Du må ha rollen "Selger" for å opprette annonser. Endre rollen i profilen din.
					</p>
					<Link
						href="/profile"
						className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
					>
						Gå til profil
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-4xl rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Ny garasje</p>
						<h1 className="text-2xl font-semibold text-foreground">Opprett annonse</h1>
						<p className="text-sm text-muted-foreground">
							Legg inn detaljer, startpris og budfrist (30 dager default om tomt).
						</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
						Til annonser
					</Link>
				</div>

				{error && (
					<div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</div>
				)}

				<form action={handleSubmit} className="grid gap-4">
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<label className="grid gap-1 text-sm text-muted-foreground">
							Tittel*
							<input
								required
								name="title"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="Oppvarmet garasjeplass i sentrum"
							/>
						</label>
						<label className="grid gap-1 text-sm text-muted-foreground">
							Størrelse*
							<input
								required
								name="size"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="5m x 2.5m"
							/>
						</label>
					</div>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Adresse / lokasjon*
						<input
							required
							name="address"
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="Storgata 1, 0101 Oslo"
						/>
					</label>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Beskrivelse
						<textarea
							name="description"
							rows={4}
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="Heis, kamera, elbillader ..."
						/>
					</label>
					<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
						<label className="grid gap-1 text-sm text-muted-foreground">
							Startpris (NOK)*
							<input
								required
								name="startPrice"
								type="number"
								min="1"
								step="0.01"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
								placeholder="1200000"
							/>
						</label>
						<label className="grid gap-1 text-sm text-muted-foreground">
							Budfrist (valgfritt, default 30d)
							<input
								name="bidEndAt"
								type="datetime-local"
								className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							/>
						</label>
					</div>
					<label className="grid gap-1 text-sm text-muted-foreground">
						Bilder (én URL per linje, last opp via /api/storage/garage-upload-url)
						<textarea
							name="images"
							rows={3}
							className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
							placeholder="https://.../garage-images/fil1.jpg"
						/>
					</label>
					<p className="text-xs text-muted-foreground">
						Tips: Kall `POST /api/storage/garage-upload-url` med filnavn for signed upload, legg
						deretter inn resulterende path/URL her. Budfrist er 30 dager hvis ikke satt.
					</p>
					<button
						type="submit"
						disabled={submitting}
						className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-50"
					>
						{submitting ? "Oppretter..." : "Opprett annonse"}
					</button>
				</form>
			</div>
		</main>
	);
}
