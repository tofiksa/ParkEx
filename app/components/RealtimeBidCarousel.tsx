"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type GarageWithBid = {
	id: string;
	title: string;
	address: string;
	startPrice: number;
	bidEndAt: string;
	highestBid: number | null;
	lastBidAt: string | null;
};

type RealtimePayload = {
	new: {
		id: string;
		garage_id: string;
		amount: number;
		created_at: string;
	};
};

const ROTATION_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function RealtimeBidCarousel({ initialGarages }: { initialGarages: GarageWithBid[] }) {
	const supabase = getSupabaseBrowserClient();
	const [garages, setGarages] = useState<GarageWithBid[]>(initialGarages);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
	const [isAnimating, setIsAnimating] = useState(false);

	// Get the current garage to display
	const currentGarage = garages.length > 0 ? garages[currentIndex % garages.length] : null;

	// Function to switch to a specific garage with animation
	const switchToGarage = useCallback(
		(garageId: string) => {
			const index = garages.findIndex((g) => g.id === garageId);
			if (index !== -1 && index !== currentIndex) {
				setIsAnimating(true);
				setTimeout(() => {
					setCurrentIndex(index);
					setLastUpdateTime(Date.now());
					setTimeout(() => setIsAnimating(false), 300);
				}, 150);
			}
		},
		[garages, currentIndex],
	);

	// Function to rotate to next garage
	const rotateToNext = useCallback(() => {
		if (garages.length <= 1) return;
		setIsAnimating(true);
		setTimeout(() => {
			setCurrentIndex((prev) => (prev + 1) % garages.length);
			setLastUpdateTime(Date.now());
			setTimeout(() => setIsAnimating(false), 300);
		}, 150);
	}, [garages.length]);

	// Subscribe to realtime bid updates
	useEffect(() => {
		if (!supabase) return;

		const channel = supabase
			.channel("homepage-bids")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "bids",
				},
				async (payload: RealtimePayload) => {
					const newBid = payload.new;

					// Update the garage in our list with the new bid
					setGarages((prev) => {
						const updated = prev.map((g) => {
							if (g.id === newBid.garage_id) {
								return {
									...g,
									highestBid: Math.max(g.highestBid ?? 0, Number(newBid.amount)),
									lastBidAt: newBid.created_at,
								};
							}
							return g;
						});

						// Sort by most recent bid
						return updated.sort((a, b) => {
							if (!a.lastBidAt && !b.lastBidAt) return 0;
							if (!a.lastBidAt) return 1;
							if (!b.lastBidAt) return -1;
							return new Date(b.lastBidAt).getTime() - new Date(a.lastBidAt).getTime();
						});
					});

					// Switch to the garage that just received a bid
					switchToGarage(newBid.garage_id);
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabase, switchToGarage]);

	// Auto-rotate every 5 minutes if no new bids
	useEffect(() => {
		const interval = setInterval(() => {
			const timeSinceLastUpdate = Date.now() - lastUpdateTime;
			if (timeSinceLastUpdate >= ROTATION_INTERVAL) {
				rotateToNext();
			}
		}, 10000); // Check every 10 seconds

		return () => clearInterval(interval);
	}, [lastUpdateTime, rotateToNext]);

	// Countdown timer for next rotation
	const [timeUntilRotation, setTimeUntilRotation] = useState(ROTATION_INTERVAL);

	useEffect(() => {
		const interval = setInterval(() => {
			const remaining = ROTATION_INTERVAL - (Date.now() - lastUpdateTime);
			setTimeUntilRotation(Math.max(0, remaining));
		}, 1000);

		return () => clearInterval(interval);
	}, [lastUpdateTime]);

	if (!currentGarage) {
		return (
			<div className="card w-full max-w-md rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/80 p-6 shadow-[0_24px_80px_rgba(7,12,28,0.55)] backdrop-blur">
				<div className="text-center text-muted-foreground">
					<p className="text-sm">Ingen aktive annonser ennå</p>
					<Link
						href="/sell/new"
						className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
					>
						Opprett den første!
					</Link>
				</div>
			</div>
		);
	}

	const isActive = new Date(currentGarage.bidEndAt) > new Date();
	const displayPrice = currentGarage.highestBid ?? currentGarage.startPrice;
	const hasBids = currentGarage.highestBid !== null;
	const minutesUntilRotation = Math.ceil(timeUntilRotation / 60000);

	return (
		<div
			className={`card w-full max-w-md rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/80 p-6 shadow-[0_24px_80px_rgba(7,12,28,0.55)] backdrop-blur transition-all duration-300 ${
				isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"
			}`}
		>
			<div className="mb-4 flex items-center justify-between">
				<div>
					<p className="text-xs uppercase tracking-wide text-primary">
						{hasBids ? "Siste bud" : "Budrunde"}
					</p>
					<h3 className="mt-1 text-xl font-semibold text-foreground">{currentGarage.title}</h3>
				</div>
				<span
					className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
						isActive
							? "border-green-500/30 bg-green-500/10 text-green-400"
							: "border-muted bg-muted/50 text-muted-foreground"
					}`}
				>
					{isActive ? "Pågår" : "Avsluttet"}
				</span>
			</div>

			<div className="space-y-2">
				<p className="text-sm text-muted-foreground">{hasBids ? "Høyeste bud" : "Startpris"}</p>
				<p className={`text-3xl font-bold ${hasBids ? "text-green-400" : "text-foreground"}`}>
					{displayPrice.toLocaleString("no-NO")} kr
				</p>
				<p className="text-sm text-muted-foreground">
					Budfrist: {new Date(currentGarage.bidEndAt).toLocaleString("no-NO")}
				</p>
			</div>

			<div className="mt-6">
				<Link
					href={`/listings/${currentGarage.id}`}
					className="block w-full rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground shadow-lg transition hover:translate-y-[-1px] hover:shadow-xl"
				>
					{isActive ? "Legg inn bud" : "Se detaljer"}
				</Link>
			</div>

			{/* Carousel indicators and timer */}
			{garages.length > 1 && (
				<div className="mt-4 flex items-center justify-between">
					<div className="flex gap-1">
						{garages.slice(0, 5).map((g, i) => (
							<button
								type="button"
								key={g.id}
								onClick={() => {
									setIsAnimating(true);
									setTimeout(() => {
										setCurrentIndex(i);
										setLastUpdateTime(Date.now());
										setTimeout(() => setIsAnimating(false), 300);
									}, 150);
								}}
								className={`h-1.5 rounded-full transition-all ${
									i === currentIndex % garages.length
										? "w-4 bg-primary"
										: "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
								}`}
								aria-label={`Gå til annonse ${i + 1}`}
							/>
						))}
						{garages.length > 5 && (
							<span className="ml-1 text-xs text-muted-foreground">+{garages.length - 5}</span>
						)}
					</div>
					<p className="text-xs text-muted-foreground">Bytter om {minutesUntilRotation} min</p>
				</div>
			)}

			{/* Realtime indicator */}
			<div className="mt-3 flex items-center gap-2">
				<span className="relative flex h-2 w-2">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
					<span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
				</span>
				<span className="text-xs text-muted-foreground">Sanntidsoppdateringer</span>
			</div>
		</div>
	);
}
