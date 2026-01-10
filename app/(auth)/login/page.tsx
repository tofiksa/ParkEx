"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginForm() {
	const supabase = getSupabaseBrowserClient();
	const searchParams = useSearchParams();
	const router = useRouter();
	const redirectTo = searchParams.get("redirect") || "/profile";
	const hasRedirected = useRef(false);

	useEffect(() => {
		if (!supabase || hasRedirected.current) return;

		// Only redirect if we're actually on the login page and user is authenticated
		// Don't redirect if we're already on the target page
		const currentPath = window.location.pathname;
		if (currentPath !== "/login" && currentPath !== "/register") {
			return;
		}

		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user && !hasRedirected.current && redirectTo !== currentPath) {
				hasRedirected.current = true;
				// Wait a bit longer to ensure cookies are synced
				setTimeout(() => {
					router.push(redirectTo);
				}, 500);
			}
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session?.user && !hasRedirected.current) {
				const currentPath = window.location.pathname;
				if (redirectTo !== currentPath) {
					hasRedirected.current = true;
					// Refresh router to sync server-side state
					router.refresh();
					// Wait longer to ensure cookies are synced with server
					// This is important for server-side auth checks
					setTimeout(async () => {
						// Verify session is still valid before redirecting
						const {
							data: { user: verifyUser },
						} = await supabase.auth.getUser();
						if (verifyUser) {
							router.push(redirectTo);
						}
					}, 1500);
				}
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, redirectTo, router]);

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
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Logg inn</p>
						<h1 className="text-2xl font-semibold text-foreground">Velkommen tilbake</h1>
						<p className="text-sm text-muted-foreground">Bruk e-post eller Google.</p>
					</div>
					<Link className="text-sm font-semibold text-primary hover:underline" href="/register">
						Ny bruker? Registrer deg
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
								color: "hsl(226 45% 96%)",
							},
							anchor: {
								color: "hsl(225 100% 68%)",
							},
						},
					}}
					providers={["google"]}
					onlyThirdPartyProviders={false}
					view="sign_in"
					redirectTo={typeof window !== "undefined" ? window.location.origin : "/"}
				/>
			</div>
		</main>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<main
					id="main"
					className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
				>
					<div className="text-sm text-muted-foreground">Laster...</div>
				</main>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
