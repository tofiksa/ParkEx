"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// User type with metadata from Supabase auth
type AuthUser = {
	id: string;
	email?: string;
	user_metadata?: {
		full_name?: string;
		name?: string;
		first_name?: string;
		last_name?: string;
		given_name?: string;
		family_name?: string;
		email?: string;
		avatar_url?: string;
		iss?: string;
	};
	app_metadata?: {
		provider?: string;
	};
};

type Profile = {
	email?: string;
	first_name?: string;
	last_name?: string;
	role?: "buyer" | "seller";
	phone?: string;
	address?: string;
};

// Helper to extract name parts from Google user metadata
function extractGoogleUserData(user: AuthUser | null): {
	firstName: string;
	lastName: string;
	email: string;
} {
	if (!user) return { firstName: "", lastName: "", email: "" };

	const metadata = user.user_metadata || {};
	const email = user.email || metadata.email || "";

	// Google typically provides full_name or name
	const fullName = metadata.full_name || metadata.name || "";
	let firstName = metadata.first_name || metadata.given_name || "";
	let lastName = metadata.last_name || metadata.family_name || "";

	// If we have full_name but not first/last, split it
	if (fullName && (!firstName || !lastName)) {
		const parts = fullName.trim().split(/\s+/);
		if (parts.length >= 2) {
			firstName = firstName || parts[0];
			lastName = lastName || parts.slice(1).join(" ");
		} else if (parts.length === 1) {
			firstName = firstName || parts[0];
		}
	}

	return { firstName, lastName, email };
}

// Check if profile is complete (has required fields)
function isProfileComplete(profile: Profile | null): boolean {
	if (!profile) return false;
	return !!(profile.first_name && profile.last_name && profile.role);
}

export default function ProfilePage() {
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [user, setUser] = useState<AuthUser | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);

	// Form state for profile completion
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		role: "" as "" | "buyer" | "seller",
		phone: "",
		address: "",
	});
	const [formError, setFormError] = useState<string | null>(null);
	const [formSuccess, setFormSuccess] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!supabase) {
			setIsAuthenticated(false);
			setLoading(false);
			return;
		}

		const loadData = async () => {
			const {
				data: { user: currentUser },
				error: userErr,
			} = await supabase.auth.getUser();

			if (userErr || !currentUser) {
				setIsAuthenticated(false);
				setLoading(false);
				router.push("/login?redirect=/profile");
				return;
			}

			setUser(currentUser as AuthUser);
			setIsAuthenticated(true);

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", currentUser.id)
				.maybeSingle();

			if (profileError && profileError.code !== "PGRST116") {
				console.error("Error fetching profile:", profileError);
			}

			setProfile(profileData);

			// Pre-fill form with existing profile data or Google user data
			const googleData = extractGoogleUserData(currentUser as AuthUser);
			setFormData({
				firstName: profileData?.first_name || googleData.firstName,
				lastName: profileData?.last_name || googleData.lastName,
				email: profileData?.email || googleData.email,
				role: profileData?.role || "",
				phone: profileData?.phone || "",
				address: profileData?.address || "",
			});

			setLoading(false);
		};

		loadData();

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
					router.push("/login?redirect=/profile");
				}
			} else {
				setIsAuthenticated(true);
				setUser(session.user as AuthUser);
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, router]);

	// Handle profile form submission
	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!supabase || !user) return;

		setFormError(null);
		setFormSuccess(false);
		setSubmitting(true);

		if (!formData.firstName || !formData.lastName || !formData.role) {
			setFormError("Vennligst fyll ut alle påkrevde felt (fornavn, etternavn, rolle).");
			setSubmitting(false);
			return;
		}

		const { error } = await supabase.from("profiles").upsert({
			id: user.id,
			first_name: formData.firstName.trim(),
			last_name: formData.lastName.trim(),
			email: formData.email.trim() || user.email,
			role: formData.role,
			phone: formData.phone.trim() || null,
			address: formData.address.trim() || null,
		});

		if (error) {
			console.error("Error saving profile:", error);
			setFormError(error.message);
			setSubmitting(false);
			return;
		}

		// Reload profile data
		const { data: updatedProfile } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", user.id)
			.maybeSingle();

		setProfile(updatedProfile);
		setFormSuccess(true);
		setSubmitting(false);
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
				<div className="text-sm text-muted-foreground">Laster profil...</div>
			</main>
		);
	}

	if (isAuthenticated === false) {
		return null; // Redirect is happening
	}

	return (
		<main
			id="main"
			className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Profil</p>
						<h1 className="text-2xl font-semibold text-foreground">Min profil</h1>
						<p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
					</div>
					<div className="flex gap-3">
						<Link className="text-sm font-semibold text-primary hover:underline" href="/listings">
							Se annonser
						</Link>
						{profile?.role === "seller" && (
							<Link className="text-sm font-semibold text-primary hover:underline" href="/sell/new">
								Opprett annonse
							</Link>
						)}
					</div>
				</div>

				<div className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur">
					<div className="space-y-4">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-primary">Brukerinformasjon</p>
							<div className="mt-3 grid gap-4 md:grid-cols-2">
								<div>
									<p className="text-sm text-muted-foreground">Navn</p>
									<p className="text-base font-semibold text-foreground">
										{profile?.first_name && profile?.last_name
											? `${profile.first_name} ${profile.last_name}`
											: "Ikke satt"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">E-post</p>
									<p className="text-base font-semibold text-foreground">
										{profile?.email ?? user.email ?? "Ikke satt"}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Rolle</p>
									<p className="text-base font-semibold text-foreground capitalize">
										{profile?.role === "buyer"
											? "Kjøper"
											: profile?.role === "seller"
												? "Selger"
												: "Ikke satt"}
									</p>
								</div>
								{profile?.phone && (
									<div>
										<p className="text-sm text-muted-foreground">Telefon</p>
										<p className="text-base font-semibold text-foreground">{profile.phone}</p>
									</div>
								)}
								{profile?.address && (
									<div className="md:col-span-2">
										<p className="text-sm text-muted-foreground">Adresse</p>
										<p className="text-base font-semibold text-foreground">{profile.address}</p>
									</div>
								)}
							</div>
						</div>

						{!isProfileComplete(profile) && (
							<div className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-6">
								<p className="mb-4 text-sm font-semibold text-foreground">
									{profile ? "Fullfør profilen din" : "Du har ikke fullført profilen din ennå"}
								</p>
								<p className="mb-4 text-xs text-muted-foreground">
									{user?.app_metadata?.provider === "google" ||
									user?.user_metadata?.iss?.includes("google")
										? "Vi har forhåndsutfylt informasjon fra Google-kontoen din. Velg rolle og lagre."
										: "Fyll ut informasjonen nedenfor for å fullføre profilen."}
								</p>

								{formError && (
									<div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
										{formError}
									</div>
								)}

								{formSuccess && (
									<div className="mb-4 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-400">
										Profilen ble lagret!
									</div>
								)}

								<form onSubmit={handleProfileSubmit} className="grid gap-4">
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										<label className="grid gap-1 text-sm text-muted-foreground">
											Fornavn*
											<input
												required
												name="firstName"
												value={formData.firstName}
												onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
												className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
												placeholder="Ola"
											/>
										</label>
										<label className="grid gap-1 text-sm text-muted-foreground">
											Etternavn*
											<input
												required
												name="lastName"
												value={formData.lastName}
												onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
												className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
												placeholder="Nordmann"
											/>
										</label>
									</div>
									<label className="grid gap-1 text-sm text-muted-foreground">
										E-post
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={(e) => setFormData({ ...formData, email: e.target.value })}
											className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
											placeholder="ola@example.com"
											disabled
										/>
									</label>
									<label className="grid gap-1 text-sm text-muted-foreground">
										Rolle*
										<select
											required
											name="role"
											value={formData.role}
											onChange={(e) =>
												setFormData({ ...formData, role: e.target.value as "buyer" | "seller" })
											}
											className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
										>
											<option value="" disabled>
												Velg rolle
											</option>
											<option value="buyer">Kjøper</option>
											<option value="seller">Selger</option>
										</select>
									</label>
									<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
										<label className="grid gap-1 text-sm text-muted-foreground">
											Telefon (valgfritt)
											<input
												name="phone"
												value={formData.phone}
												onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
												className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
												placeholder="+47 999 99 999"
											/>
										</label>
										<label className="grid gap-1 text-sm text-muted-foreground">
											Adresse (valgfritt)
											<input
												name="address"
												value={formData.address}
												onChange={(e) => setFormData({ ...formData, address: e.target.value })}
												className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
												placeholder="Storgata 1, 0101 Oslo"
											/>
										</label>
									</div>
									<button
										type="submit"
										disabled={submitting}
										className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-50"
									>
										{submitting ? "Lagrer..." : "Lagre profil"}
									</button>
								</form>
							</div>
						)}
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<Link
						href="/profile/bids"
						className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-md backdrop-blur transition hover:border-border hover:shadow-lg"
					>
						<p className="text-sm font-semibold text-foreground">Mine bud</p>
						<p className="mt-1 text-xs text-muted-foreground">Se alle budene du har lagt inn</p>
					</Link>
					{profile?.role === "seller" && (
						<>
							<Link
								href="/profile/listings"
								className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-md backdrop-blur transition hover:border-border hover:shadow-lg"
							>
								<p className="text-sm font-semibold text-foreground">Mine annonser</p>
								<p className="mt-1 text-xs text-muted-foreground">
									Se dine garasjer og høyeste bud
								</p>
							</Link>
							<Link
								href="/sell/new"
								className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-md backdrop-blur transition hover:border-border hover:shadow-lg"
							>
								<p className="text-sm font-semibold text-foreground">Opprett annonse</p>
								<p className="mt-1 text-xs text-muted-foreground">Legg ut en ny garasjeannonse</p>
							</Link>
						</>
					)}
				</div>
			</div>
		</main>
	);
}
