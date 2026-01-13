"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
const LOGOUT_COUNTDOWN = 30; // 30 seconds before auto-logout

export function InactivityGuard() {
	const supabase = getSupabaseBrowserClient();
	const router = useRouter();
	const pathname = usePathname();

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [countdown, setCountdown] = useState(LOGOUT_COUNTDOWN);

	const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
	const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<number>(Date.now());

	// Logout function - clears all sessions
	const performLogout = useCallback(async () => {
		if (!supabase) return;

		try {
			// Clear all timers
			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
			}
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}

			// Sign out from ALL sessions globally
			const { error } = await supabase.auth.signOut({ scope: "global" });

			if (error) {
				console.error("Error during global sign out:", error);
				// Fallback to local sign out
				await supabase.auth.signOut({ scope: "local" });
			}

			// Clear local storage items related to auth
			if (typeof window !== "undefined") {
				// Clear Supabase auth storage
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

			setIsAuthenticated(false);
			setShowModal(false);

			// Redirect to homepage
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Error during logout:", error);
			// Force redirect even on error
			router.push("/");
			router.refresh();
		}
	}, [supabase, router]);

	// Reset inactivity timer
	const resetInactivityTimer = useCallback(() => {
		lastActivityRef.current = Date.now();

		// Clear existing timer
		if (inactivityTimerRef.current) {
			clearTimeout(inactivityTimerRef.current);
		}

		// Don't set timer if modal is showing or user is not authenticated
		if (showModal || !isAuthenticated) return;

		// Set new inactivity timer
		inactivityTimerRef.current = setTimeout(() => {
			setShowModal(true);
			setCountdown(LOGOUT_COUNTDOWN);
		}, INACTIVITY_TIMEOUT);
	}, [showModal, isAuthenticated]);

	// Handle user activity
	const handleActivity = useCallback(() => {
		if (!showModal) {
			resetInactivityTimer();
		}
	}, [showModal, resetInactivityTimer]);

	// Extend session - user clicked to stay logged in
	const extendSession = useCallback(() => {
		setShowModal(false);
		setCountdown(LOGOUT_COUNTDOWN);
		resetInactivityTimer();
	}, [resetInactivityTimer]);

	// Check authentication status
	useEffect(() => {
		if (!supabase) return;

		const checkAuth = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setIsAuthenticated(!!user);
		};

		checkAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setIsAuthenticated(!!session?.user);
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, [supabase]);

	// Start/reset inactivity timer when auth state changes
	useEffect(() => {
		if (isAuthenticated) {
			resetInactivityTimer();
		}
	}, [isAuthenticated, resetInactivityTimer]);

	// Set up activity listeners
	useEffect(() => {
		if (!isAuthenticated) return;

		const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

		for (const event of events) {
			window.addEventListener(event, handleActivity, { passive: true });
		}

		return () => {
			for (const event of events) {
				window.removeEventListener(event, handleActivity);
			}

			if (inactivityTimerRef.current) {
				clearTimeout(inactivityTimerRef.current);
			}
		};
	}, [isAuthenticated, handleActivity]);

	// Countdown timer when modal is showing
	useEffect(() => {
		if (!showModal) {
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}
			return;
		}

		countdownTimerRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					performLogout();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			if (countdownTimerRef.current) {
				clearInterval(countdownTimerRef.current);
			}
		};
	}, [showModal, performLogout]);

	// Don't render on auth pages
	if (pathname === "/login" || pathname === "/register") {
		return null;
	}

	// Don't render if not authenticated
	if (!isAuthenticated) {
		return null;
	}

	// Render the warning modal
	if (!showModal) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div
				className="mx-4 w-full max-w-md rounded-2xl border border-border/80 bg-card p-6 shadow-2xl"
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="inactivity-title"
				aria-describedby="inactivity-description"
			>
				{/* Warning icon */}
				<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
					<svg
						className="h-8 w-8 text-amber-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>

				<h2
					id="inactivity-title"
					className="mb-2 text-center text-xl font-semibold text-foreground"
				>
					Er du fortsatt der?
				</h2>

				<p id="inactivity-description" className="mb-4 text-center text-sm text-muted-foreground">
					Du har vært inaktiv i over 10 minutter. Av sikkerhetsgrunner vil du bli logget ut om:
				</p>

				{/* Countdown display */}
				<div className="mb-6 flex flex-col items-center">
					<div className="relative h-20 w-20">
						{/* Circular progress */}
						<svg className="h-20 w-20 -rotate-90 transform" aria-hidden="true">
							<circle
								cx="40"
								cy="40"
								r="36"
								stroke="currentColor"
								strokeWidth="4"
								fill="transparent"
								className="text-muted/30"
							/>
							<circle
								cx="40"
								cy="40"
								r="36"
								stroke="currentColor"
								strokeWidth="4"
								fill="transparent"
								strokeDasharray={226}
								strokeDashoffset={226 - (226 * countdown) / LOGOUT_COUNTDOWN}
								className={`transition-all duration-1000 ${
									countdown <= 10 ? "text-red-500" : "text-amber-500"
								}`}
							/>
						</svg>
						{/* Countdown number */}
						<div className="absolute inset-0 flex items-center justify-center">
							<span
								className={`text-2xl font-bold ${
									countdown <= 10 ? "text-red-500" : "text-foreground"
								}`}
								aria-live="polite"
							>
								{countdown}
							</span>
						</div>
					</div>
					<p className="mt-2 text-xs text-muted-foreground">sekunder</p>
				</div>

				{/* Action buttons */}
				<div className="flex flex-col gap-3">
					<button
						type="button"
						onClick={extendSession}
						className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
					>
						Ja, fortsett økten
					</button>
					<button
						type="button"
						onClick={performLogout}
						className="w-full rounded-lg border border-border/80 bg-background/50 px-4 py-3 text-sm text-muted-foreground transition hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2"
					>
						Logg ut nå
					</button>
				</div>

				<p className="mt-4 text-center text-xs text-muted-foreground">
					Dette er for å beskytte kontoen din.
				</p>
			</div>
		</div>
	);
}
