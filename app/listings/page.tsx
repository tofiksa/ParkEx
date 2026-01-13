import Link from "next/link";
import { GarageCard } from "@/components/GarageCard";
import { SortLink } from "@/components/SortLink";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { GarageWithBid } from "@/types";

type SortOption = "newest" | "price_high" | "price_low" | "bids_first";

export default async function ListingsPage({
	searchParams,
}: {
	searchParams: Promise<{ sort?: string }>;
}) {
	const params = await searchParams;
	const sortBy = (params.sort as SortOption) || "newest";

	const supabase = await getSupabaseServerClient();
	if (!supabase) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16"
			>
				<p className="text-sm text-red-400">
					Mangler Supabase konfig (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).
				</p>
			</main>
		);
	}

	// Only fetch active listings (bid_end_at > now)
	const { data: garages, error } = await supabase
		.from("garages")
		.select("id, title, address, start_price, bid_end_at")
		.gt("bid_end_at", new Date().toISOString())
		.order("created_at", { ascending: false })
		.limit(50);

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 md:py-16">
				<p className="text-sm text-red-400">Kunne ikke hente annonser: {error.message}</p>
			</main>
		);
	}

	if (!garages?.length) {
		return (
			<main
				id="main"
				className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
			>
				<div className="w-full max-w-6xl">
					<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-primary">Annonser</p>
							<h1 className="text-2xl font-semibold text-foreground">Garasjer til salgs</h1>
						</div>
						<Link
							className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl sm:w-auto"
							href="/sell/new"
						>
							Opprett annonse
						</Link>
					</div>
					<div className="rounded-xl border border-border/70 bg-card/70 p-4 text-sm text-muted-foreground">
						Ingen aktive annonser ennå.
					</div>
				</div>
			</main>
		);
	}

	const garageIds = garages.map((g) => g.id);

	// Fetch all bids for these garages
	const { data: allBids } = await supabase
		.from("bids")
		.select("garage_id, amount")
		.in("garage_id", garageIds);

	// Build highest bid and count map
	const bidInfoMap = new Map<string, { highest: number; count: number }>();
	for (const bid of allBids ?? []) {
		const existing = bidInfoMap.get(bid.garage_id);
		const amount = Number(bid.amount);
		if (!existing) {
			bidInfoMap.set(bid.garage_id, { highest: amount, count: 1 });
		} else {
			existing.count++;
			if (amount > existing.highest) {
				existing.highest = amount;
			}
		}
	}

	const now = new Date();

	// Build garage list with bid info
	const garagesWithBids: GarageWithBid[] = garages.map((g) => {
		const bidInfo = bidInfoMap.get(g.id);
		return {
			id: g.id,
			title: g.title,
			address: g.address,
			startPrice: Number(g.start_price),
			bidEndAt: g.bid_end_at,
			highestBid: bidInfo?.highest ?? null,
			bidCount: bidInfo?.count ?? 0,
			isActive: new Date(g.bid_end_at) > now,
		};
	});

	// Sort based on selected option
	const sortedGarages = [...garagesWithBids].sort((a, b) => {
		switch (sortBy) {
			case "price_high": {
				const priceA = a.highestBid ?? a.startPrice;
				const priceB = b.highestBid ?? b.startPrice;
				return priceB - priceA;
			}
			case "price_low": {
				const priceA = a.highestBid ?? a.startPrice;
				const priceB = b.highestBid ?? b.startPrice;
				return priceA - priceB;
			}
			case "bids_first": {
				// Sort by has bids first, then by highest bid descending
				if (a.bidCount > 0 && b.bidCount === 0) return -1;
				if (a.bidCount === 0 && b.bidCount > 0) return 1;
				if (a.bidCount > 0 && b.bidCount > 0) {
					return (b.highestBid ?? 0) - (a.highestBid ?? 0);
				}
				return 0;
			}
			default:
				return 0; // "newest" - already sorted by created_at desc from DB
		}
	});

	const withBids = sortedGarages.filter((g) => g.bidCount > 0).length;
	const withoutBids = sortedGarages.length - withBids;

	return (
		<main
			id="main"
			className="flex min-h-screen items-start justify-center bg-transparent px-4 py-12 sm:px-6 md:py-16"
		>
			<div className="w-full max-w-6xl">
				<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] text-primary">Annonser</p>
						<h1 className="text-2xl font-semibold text-foreground">Garasjer til salgs</h1>
						<p className="text-sm text-muted-foreground">
							{sortedGarages.length} aktive · {withBids} med bud · {withoutBids} uten bud
						</p>
					</div>
					<Link
						className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-[1px] hover:shadow-xl sm:w-auto"
						href="/sell/new"
					>
						Opprett annonse
					</Link>
				</div>

				{/* Sort options */}
				<div className="mb-4 flex flex-wrap gap-2">
					<SortLink href="/listings?sort=newest" active={sortBy === "newest"}>
						Nyeste
					</SortLink>
					<SortLink href="/listings?sort=bids_first" active={sortBy === "bids_first"}>
						Med bud først
					</SortLink>
					<SortLink href="/listings?sort=price_high" active={sortBy === "price_high"}>
						Pris: Høy → Lav
					</SortLink>
					<SortLink href="/listings?sort=price_low" active={sortBy === "price_low"}>
						Pris: Lav → Høy
					</SortLink>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{sortedGarages.map((g) => (
						<GarageCard key={g.id} garage={g} />
					))}
				</div>
			</div>
		</main>
	);
}
