"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();
	const hasRedirected = useRef(false);

	useEffect(() => {
		if (!supabase || hasRedirected.current) return;

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session?.user && !hasRedirected.current) {
				hasRedirected.current = true;
				router.refresh();
				// Redirect to profile to complete registration
				setTimeout(() => {
					router.push("/profile");
				}, 500);
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, router]);

	if (!supabase) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<p className="text-sm text-red-400">
					Mangler Supabase klient-konfig. Sett NEXT_PUBLIC_SUPABASE_URL og
					NEXT_PUBLIC_SUPABASE_ANON_KEY.
				</p>
			</main>
		);
	}

	return (
		<main
			id="main"
			className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-3xl rounded-2xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Registrering</p>
						<h1 className="text-2xl font-semibold text-foreground">Opprett konto</h1>
						<p className="text-sm text-muted-foreground">
							Opprett konto med e-post eller Google. Du fullfører profilen etterpå.
						</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/login">
						Har du konto? Logg inn
					</Link>
				</div>
				<Auth
					supabaseClient={supabase}
					appearance={{
						theme: ThemeSupa,
						variables: {
							default: {
								colors: {
									brand: "hsl(225 100% 68%)",
									brandAccent: "hsl(225 100% 75%)",
								},
							},
						},
						style: {
							input: {
								color: "hsl(226 45% 96%)",
								backgroundColor: "hsl(230 50% 8%)",
							},
							label: {
								color: "hsl(226 45% 96%)",
							},
							message: {
								/* WCAG compliant: light green text on dark green bg (~10:1 contrast) */
								color: "#d1fae5",
								backgroundColor: "#064e3b",
								border: "1px solid #10b981",
								borderRadius: "0.5rem",
								padding: "1rem",
								marginTop: "0.5rem",
							},
							anchor: {
								color: "hsl(225 100% 68%)",
							},
						},
					}}
					localization={{
						variables: {
							sign_up: {
								email_label: "E-postadresse",
								password_label: "Opprett passord",
								email_input_placeholder: "Din e-postadresse",
								password_input_placeholder: "Ditt passord",
								button_label: "Opprett konto",
								loading_button_label: "Oppretter konto...",
								social_provider_text: "Registrer deg med {{provider}}",
								link_text: "Har du allerede en konto? Logg inn",
								confirmation_text: "Sjekk e-posten din for bekreftelseslenke",
							},
							sign_in: {
								link_text: "Har du allerede en konto? Logg inn",
							},
						},
					}}
					providers={["google"]}
					onlyThirdPartyProviders={false}
					view="sign_up"
					redirectTo={
						typeof window !== "undefined" ? `${window.location.origin}/profile` : "/profile"
					}
				/>
				<p className="mt-4 text-center text-xs text-muted-foreground">
					Etter registrering blir du sendt til profilsiden for å fullføre oppsettet.
				</p>
			</div>
		</main>
	);
}
