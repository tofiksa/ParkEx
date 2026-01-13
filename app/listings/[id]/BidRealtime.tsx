"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { BidDisplay } from "@/types";
import { BidForm } from "./BidForm";

type Props = {
	garageId: string;
	startPrice: number;
	initialBids: BidDisplay[];
};

export function BidRealtime({ garageId, startPrice, initialBids }: Props) {
	const [bids, setBids] = useState<BidDisplay[]>(initialBids);
	const topBid = bids[0];
	const minRequired = Math.max(startPrice, topBid?.amount ?? 0) + 1;

	useEffect(() => {
		const supabase = getSupabaseBrowserClient();
		const channel = supabase
			.channel(`bids:${garageId}`)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "bids", filter: `garage_id=eq.${garageId}` },
				(payload) => {
					const newBid = payload.new as BidDisplay;
					setBids((prev) =>
						[...prev, newBid].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5),
					);
				},
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, [garageId]);

	return (
		<div className="space-y-4">
			<div>
				<p className="text-xs uppercase tracking-[0.18em] text-primary">Siste bud</p>
				{topBid ? (
					<div className="mt-2">
						<p className="text-2xl font-bold text-foreground">
							{Number(topBid.amount).toLocaleString("no-NO")} kr
						</p>
						<p className="text-sm text-muted-foreground">
							{new Date(topBid.created_at).toLocaleString("no-NO")}
						</p>
					</div>
				) : (
					<p className="mt-2 text-sm text-muted-foreground">Ingen bud ennå.</p>
				)}
				{bids.length > 1 && (
					<ul className="mt-4 space-y-1 text-sm text-muted-foreground">
						{bids.map((b, idx) => (
							<li key={`${b.created_at}-${idx}`}>
								{Number(b.amount).toLocaleString("no-NO")} kr —{" "}
								{new Date(b.created_at).toLocaleString("no-NO")}
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-xl backdrop-blur">
				<p className="text-xs uppercase tracking-[0.18em] text-primary">Legg inn bud</p>
				<p className="text-sm text-muted-foreground">
					Minste gyldige bud: {minRequired.toLocaleString("no-NO")} kr
				</p>
				<div className="mt-3">
					<BidForm garageId={garageId} minRequired={minRequired} />
				</div>
			</div>
		</div>
	);
}
