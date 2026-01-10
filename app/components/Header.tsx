"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function Header() {
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();
	const pathname = usePathname();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!supabase) {
			setIsAuthenticated(false);
			setLoading(false);
			return;
		}

		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setIsAuthenticated(!!user);
			setUserEmail(user?.email ?? null);
			setLoading(false);
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session?.user);
			setUserEmail(session?.user?.email ?? null);
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase]);

	const handleLogout = async () => {
		if (!supabase) return;

		try {
			// Sign out from ALL sessions globally
			const { error } = await supabase.auth.signOut({ scope: "global" });
			
			if (error) {
				console.error("Error during global sign out:", error);
				// Fallback to local sign out
				await supabase.auth.signOut({ scope: "local" });
			}

			// Clear local storage items related to auth
			if (typeof window !== "undefined") {
				const keysToRemove: string[] = [];
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (key?.startsWith("sb-") || key?.includes("supabase")) {
						keysToRemove.push(key);
					}
				}
				for (const key of keysToRemove) {
					localStorage.removeItem(key);
				}

				// Clear session storage too
				const sessionKeysToRemove: string[] = [];
				for (let i = 0; i < sessionStorage.length; i++) {
					const key = sessionStorage.key(i);
					if (key?.startsWith("sb-") || key?.includes("supabase")) {
						sessionKeysToRemove.push(key);
					}
				}
				for (const key of sessionKeysToRemove) {
					sessionStorage.removeItem(key);
				}
			}

			// Clear local state
			setIsAuthenticated(false);
			setUserEmail(null);

			// Redirect to home page
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error during logout:", error);
			// Force redirect even on error
			router.push("/");
			router.refresh();
		}
	};

	// Don't show header on auth pages
	if (pathname === "/login" || pathname === "/register") {
		return null;
	}

	return (
		<header className="border-b border-border/60 bg-card/50 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
				<Link href="/" className="text-lg font-semibold text-foreground hover:text-primary">
					ParkEx
				</Link>

				<nav className="flex items-center gap-4">
					<Link
						href="/listings"
						className="text-sm text-foreground hover:text-primary transition-colors"
					>
						Annonser
					</Link>

					{loading ? (
						<div className="text-xs text-muted-foreground">Laster...</div>
					) : isAuthenticated ? (
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-1.5">
								<div className="h-2 w-2 rounded-full bg-green-500" title="Innlogget" />
								<span className="text-xs text-muted-foreground">
									{userEmail ? userEmail.split("@")[0] : "Bruker"}
								</span>
							</div>
							<Link
								href="/profile"
								className="text-sm text-foreground hover:text-primary transition-colors"
							>
								Profil
							</Link>
							<button
								type="button"
								onClick={handleLogout}
								className="rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-border hover:bg-background"
							>
								Logg ut
							</button>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-1.5">
								<div className="h-2 w-2 rounded-full bg-gray-500" title="Ikke innlogget" />
								<span className="text-xs text-muted-foreground">Ikke innlogget</span>
							</div>
							<Link
								href="/login"
								className="rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-border hover:bg-background"
							>
								Logg inn
							</Link>
							<Link
								href="/register"
								className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
							>
								Registrer deg
							</Link>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
}

