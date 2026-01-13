"use client";

import type { User } from "@supabase/supabase-js";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
	garageId: string;
	minRequired: number;
};

export function BidForm({ garageId, minRequired }: Props) {
	const [amount, setAmount] = useState(minRequired);
	const [message, setMessage] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [checkingAuth, setCheckingAuth] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const checkAuth = async () => {
			const supabase = getSupabaseBrowserClient();
			if (!supabase) {
				setCheckingAuth(false);
				return;
			}

			const {
				data: { user: currentUser },
			} = await supabase.auth.getUser();
			setUser(currentUser);
			setCheckingAuth(false);
		};

		checkAuth();
	}, []);

	const submitBid = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) {
			router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
			return;
		}

		setSubmitting(true);
		setMessage(null);
		const res = await fetch("/api/bids", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ garageId, amount: Number(amount) }),
		});
		const json = await res.json();
		if (!res.ok) {
			if (res.status === 401) {
				router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
				return;
			}
			setMessage(json.error ?? "Ukjent feil");
		} else {
			setMessage("Bud registrert!");
		}
		setSubmitting(false);
	};

	if (checkingAuth) {
		return (
			<div className="space-y-3">
				<p className="text-sm text-muted-foreground">Sjekker autentisering...</p>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="space-y-3">
				<p className="text-sm text-muted-foreground">Du må være innlogget for å legge inn bud.</p>
				<a
					href={`/login?redirect=${encodeURIComponent(pathname)}`}
					className="block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
				>
					Logg inn for å legge inn bud
				</a>
			</div>
		);
	}

	return (
		<form onSubmit={submitBid} className="space-y-3">
			<label className="grid gap-1 text-sm text-muted-foreground">
				Beløp (NOK) — min {minRequired.toLocaleString("no-NO")}
				<input
					type="number"
					min={minRequired}
					step="1"
					value={amount}
					onChange={(e) => setAmount(Number(e.target.value))}
					className="rounded-md border border-border bg-background px-3 py-2 text-foreground"
				/>
			</label>
			<button
				type="submit"
				disabled={submitting}
				className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl disabled:opacity-60"
			>
				{submitting ? "Sender..." : "Legg inn bud"}
			</button>
			{message && <p className="text-sm text-muted-foreground">{message}</p>}
		</form>
	);
}
