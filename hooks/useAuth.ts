"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface UseAuthOptions {
	/** Redirect to this URL if not authenticated */
	redirectTo?: string;
	/** Require authentication (default: false) */
	required?: boolean;
}

export interface UseAuthReturn {
	user: User | null;
	loading: boolean;
	isAuthenticated: boolean;
	signOut: () => Promise<void>;
}

/**
 * Hook for managing authentication state
 *
 * @example
 * // Basic usage
 * const { user, loading, isAuthenticated } = useAuth();
 *
 * @example
 * // Require authentication with redirect
 * const { user, loading } = useAuth({ required: true, redirectTo: '/login' });
 */
export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
	const { redirectTo, required = false } = options;
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!supabase) {
			setLoading(false);
			if (required && redirectTo) {
				router.push(redirectTo);
			}
			return;
		}

		const checkAuth = async () => {
			const {
				data: { user: currentUser },
			} = await supabase.auth.getUser();
			setUser(currentUser);
			setLoading(false);

			if (!currentUser && required && redirectTo) {
				router.push(redirectTo);
			}
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			const newUser = session?.user ?? null;
			setUser(newUser);

			if (event === "SIGNED_OUT" && redirectTo) {
				router.push("/");
			} else if (!newUser && required && redirectTo) {
				router.push(redirectTo);
			}
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase, router, redirectTo, required]);

	const signOut = useCallback(async () => {
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
			setUser(null);

			// Redirect to home page
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error during logout:", error);
			// Force redirect even on error
			router.push("/");
			router.refresh();
		}
	}, [supabase, router]);

	return {
		user,
		loading,
		isAuthenticated: !!user,
		signOut,
	};
}
